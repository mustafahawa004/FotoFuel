// src/components/FileUpload.js
import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileUrl(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    // Perform file upload logic here (e.g., send the file to a server).
    // For demonstration purposes, we'll just log the file details.
    if (selectedFile) {
      console.log('Uploading file:', selectedFile);
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
    </div>
  );
};

export default FileUpload;
