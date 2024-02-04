# flask-backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/process_image', methods=['POST'])
def process_image():
    try:
        image_url = request.json['image_url']
        # Call datacollection.py with the image_url
        result = subprocess.run(['python', 'C:\Users\seanf\Desktop\VS Code\Hackathon\FotoFuel\datacollection.py', image_url], capture_output=True, text=True)
        # Process the result as needed
        return jsonify({'result': result.stdout})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(port=5000)

