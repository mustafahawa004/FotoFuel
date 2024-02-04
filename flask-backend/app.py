from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess  # Remember to import subprocess if you're using it

app = Flask(__name__)
CORS(app)

# Define the base directory of your app
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Define the upload folder path relative to the base directory
UPLOAD_FOLDER = os.path.join(BASE_DIR, '..', 'uploads')

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return jsonify({'message': 'Hello, this is the home page!'})

@app.route('/process_image', methods=['POST'])
def process_image():
    try:
        image_url = request.json['image_url']
        datacollection_path = os.path.join(BASE_DIR, 'datacollection.py')
        result = subprocess.run(['python', datacollection_path, image_url], capture_output=True, text=True)
        nutritional_info = result.stdout  # Extract nutritional info from the result
        return jsonify({'nutritional_info': nutritional_info}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
