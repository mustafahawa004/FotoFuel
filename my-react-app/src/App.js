// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SuccessPage from './components/SuccessPage';
import FileUpload from './components/FileUpload';

const logoPath = '/logo/logo'; // Base path for logo files (update based on your project structure)

const getLogoPath = (fileType) => `${logoPath}.${fileType}`;

function App() {
  const [uploadResponse, setUploadResponse] = useState(null);
  const handleUploadSuccess = (data) => {
    setUploadResponse(data);
  };
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={getLogoPath('png')} alt="Logo" className="App-logo" />
          {/* The Routes component replaces the Switch component from v5 */}
          <Routes>
            <Route path="/" element={
              <>
                <FileUpload onSuccess={handleUploadSuccess} />
                {/* Directly displaying uploadResponse won't work as expected here, because this needs to be outside of the Routes */}
              </>
            } />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
          {/* Conditionally rendering response outside of Routes */}
          {uploadResponse && (
            <div>
              <h3>Upload Response</h3>
              <p>{JSON.stringify(uploadResponse, null, 2)}</p>
            </div>
          )}
        </header>
      </div>
    </Router>
  );
}


export default App;
