// src/components/FileUpload.js
import React, { useState } from 'react';

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
    <div>
      <img src={fileUrl || '/images/your_logo.png'} alt="Logo" style={{ width: '150px', height: '150px' }} />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
