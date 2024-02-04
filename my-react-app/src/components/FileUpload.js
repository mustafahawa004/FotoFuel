import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/upload_image', {
        method: 'POST',
        body: formData, // No headers needed, fetch adds the correct multipart/form-data header automatically
      });
      const data = await response.json();
      
      if (response.ok) {
        setUploadStatus('Upload successful!');
        console.log('Server response:', data);
        // Here you can also update the state to pass this response to another component or trigger a redirect
      } else {
        setUploadStatus('Upload failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Upload failed: ' + error.message);
    }
  };

  return (
    <div className="file-upload-container">
      <label htmlFor="file-input" className="file-upload-label">
        <div className="file-upload-box">
          <span className="file-upload-text">Choose a file</span>
          <span className="file-upload-arrow">&#8595;</span>
        </div>
      </label>
      <input
        id="file-input"
        type="file"
        onChange={handleFileChange}
        className="file-upload-input"
      />
      <button onClick={handleUpload} className="nice-button">
        Upload
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default FileUpload;
