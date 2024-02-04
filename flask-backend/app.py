from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import requests
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_code_pb2
import subprocess  # Remember to import subprocess if you're using it

app = Flask(__name__)
CORS(app)

# Define the base directory of your app
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PAT = 'd301c71a42504160b90ef870c7f410dc'
USER_ID = 'clarifai'
APP_ID = 'main'
MODEL_ID = 'food-item-v1-recognition'
MODEL_VERSION_ID = 'dfebc169854e429086aceb8368662641'
API_NINJA_API_KEY = 'IUWRgqfCgZE9LKNKXfzEKA==G6bLKD0vWAh5GcTW'

# Define the upload folder path relative to the base directory
UPLOAD_FOLDER = os.path.join(BASE_DIR, '..', 'uploads')

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return jsonify({'message': 'Hello, this is the home page!'})

@app.route('/api/get_food_data', methods=['POST'])
def process_image():
    try:
        uploaded_file = request.files['image']
        uploaded_file.save('temp_image.jpg')  # Save temporarily

        # Setup Clarifai connection and process image
        channel = ClarifaiChannel.get_grpc_channel()
        stub = service_pb2_grpc.V2Stub(channel)
        metadata = (('authorization', 'Key ' + PAT),)

        with open('temp_image.jpg', "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode('utf-8')

        post_model_outputs_response = stub.PostModelOutputs(
            service_pb2.PostModelOutputsRequest(
                user_app_id=resources_pb2.UserAppIDSet(user_id=USER_ID, app_id=APP_ID),
                model_id=MODEL_ID,
                version_id=MODEL_VERSION_ID,
                inputs=[resources_pb2.Input(data=resources_pb2.Data(image=resources_pb2.Image(base64=base64_image)))]
            ),
            metadata=metadata
        )

        if post_model_outputs_response.status.code != status_code_pb2.SUCCESS:
            return jsonify({"error": "Failed to process image"}), 500

        # Extract the best concept
        best_concept = max(post_model_outputs_response.outputs[0].data.concepts, key=lambda c: c.value)
        food_item = best_concept.name

        # Fetch nutrition data based on identified food item
        api_url = f'https://api.api-ninjas.com/v1/nutrition?query={food_item}'
        headers = {'X-Api-Key': API_NINJA_API_KEY}
        response = requests.get(api_url, headers=headers)

        if response.status_code == requests.codes.ok:
            nutrition_data = response.json()
            return jsonify({"food_item": food_item, "nutrition_data": nutrition_data}), 200
        else:
            return jsonify({"error": f"Failed to fetch nutrition data. API responded with status code {response.status_code}"}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    try:
        datacollection_path = os.path.join(BASE_DIR, 'datacollection.py')
        result = subprocess.run(['python', datacollection_path, filepath], capture_output=True, text=True)
        nutritional_info = result.stdout  # Extract nutritional info from the result
        return jsonify({'result': 'File uploaded successfully', 'nutritional_info': nutritional_info}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
