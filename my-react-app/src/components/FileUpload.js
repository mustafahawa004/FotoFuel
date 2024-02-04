import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FileUpload.css';

// Accept props in the component function
const FileUpload = ({ onSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    // Optionally set a URL for the file preview, if needed
    // setFileUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile); // Ensure this key matches the one expected by Flask

    try {
        const response = await fetch('http://localhost:5000/process_image', { // Updated URL
          method: 'POST',
          body: formData,
          // Removed headers to allow browser to set Content-Type with boundary
        });
        const data = await response.json();
  
        if (response.ok) {
          setUploadStatus('Upload successful!');
          console.log('Server response:', data);
          onSuccess && onSuccess(data);
          navigate('/success');
        } else {
          setUploadStatus('Upload failed: ' + (data.error || 'Unknown error'));
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
