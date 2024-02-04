from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/process_image', methods=['POST'])
def process_image():
    try:
        image_url = request.json['image_url']
        # Call datacollection.py with the image_url
        result = subprocess.run(['python', 'C:\\Users\\seanf\\Desktop\\VS Code\\Hackathon\\FotoFuel\\datacollection.py', image_url], capture_output=True, text=True)
        # Process the result as needed
        return jsonify({'result': result.stdout})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    # Ensure the file is saved in a secure location, possibly with a unique filename
    filepath = os.path.join('C:\\path\\to\\save\\uploaded\\files', file.filename)
    file.save(filepath)
    # After saving the file, you can process it as needed
    try:
        # Assuming datacollection.py can also handle file paths
        result = subprocess.run(['python', 'C:\\Users\\seanf\\Desktop\\VS Code\\Hackathon\\FotoFuel\\datacollection.py', filepath], capture_output=True, text=True)
        return jsonify({'result': result.stdout})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(port=5000)
