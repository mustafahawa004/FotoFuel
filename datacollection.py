from flask import Flask, request, jsonify
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_code_pb2
import requests

app = Flask(__name__)

# Replace 'YOUR_CLARIFAI_API_KEY' with your actual Clarifai API key
CLARIFAI_API_KEY = 'd301c71a42504160b90ef870c7f410dc'
PAT = CLARIFAI_API_KEY

USER_ID = 'clarifai'
APP_ID = 'main'
MODEL_ID = 'food-item-recognition'
MODEL_VERSION_ID = '1d5fd481e0cf4826aa72ec3ff049e044'

@app.route('/upload_image', methods=['POST'])
def upload_image():
    # Get the uploaded file from the request
    uploaded_file = request.files['image']

    # Save the uploaded file to a temporary location (you may want to handle this differently in a production setting)
    uploaded_file.save('temp_image.jpg')

    # Perform analysis using Clarifai
    channel = ClarifaiChannel.get_grpc_channel()
    stub = service_pb2_grpc.V2Stub(channel)
    metadata = (('authorization', 'Key ' + PAT),)

    userDataObject = resources_pb2.UserAppIDSet(user_id=USER_ID, app_id=APP_ID)

    post_model_outputs_response = stub.PostModelOutputs(
        service_pb2.PostModelOutputsRequest(
            user_app_id=userDataObject,
            model_id=MODEL_ID,
            version_id=MODEL_VERSION_ID,
            inputs=[
                resources_pb2.Input(
                    data=resources_pb2.Data(
                        image=resources_pb2.Image(
                            base64=request.files['image'].read().encode('base64')
                        )
                    )
                )
            ]
        ),
        metadata=metadata
    )

    if post_model_outputs_response.status.code != status_code_pb2.SUCCESS:
        return jsonify({"error": "Post model outputs failed", "status": post_model_outputs_response.status.description}), 500

    output = post_model_outputs_response.outputs[0]
    best_concept = max(output.data.concepts, key=lambda x: x.value)

    if best_concept:
        # Use the best predicted concept as the query for the nutrition API
        query = best_concept.name

        # Call the nutrition API with the query
        api_url = 'https://api.api-ninjas.com/v1/nutrition?query={}'.format(query)
        response = requests.get(api_url, headers={'X-Api-Key': 'IUWRgqfCgZE9LKNKXfzEKA==G6bLKD0vWAh5GcTW'})

        if response.status_code == requests.codes.ok:
            return jsonify({"result": response.text}), 200
        else:
            return jsonify({"error": "Error calling nutrition API", "status_code": response.status_code, "response_text": response.text}), 500
    else:
        return jsonify({"error": "No predicted concept available."}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
