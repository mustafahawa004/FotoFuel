// src/App.js
import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';

const logoPath = '/logo/logo'; // Base path for logo files (update based on your project structure)

const getLogoPath = (fileType) => `${logoPath}.${fileType}`;

function App() {
  const [uploadResponse, setUploadResponse] = useState(null);
  const handleUploadSuccess = (data) => {
    setUploadResponse(data);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={getLogoPath('png')} alt="Logo" className="App-logo" />
        {/* Pass the handleUploadSuccess function as a prop to FileUpload */}
        <FileUpload onSuccess={handleUploadSuccess} />
        {/* Check if there's a response and display it */}
        {uploadResponse && (
          <div>
            <h3>Upload Response</h3>
            {/* Properly format and display the upload response data */}
            <p>{JSON.stringify(uploadResponse, null, 2)}</p>
          </div>
        )}
      </header>
    </div>
  );
}


export default App;
