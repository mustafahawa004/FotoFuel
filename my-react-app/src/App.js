// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Link
import './App.css';
import SuccessPage from './components/SuccessPage';
import FileUpload from './components/FileUpload';

const logoPath = '/logo/logo'; // Base path for logo files (update based on your project structure)

const getLogoPath = (fileType) => `${logoPath}.${fileType}`;

function App() {
  const [uploadResponse, setUploadResponse] = useState(null);
  const [isTranslated, setIsTranslated] = useState(false);
  const [direction, setDirection] = useState('left'); // Initial direction is left

  const handleUploadSuccess = (data) => {
    setUploadResponse(data);
  };
  const handleTranslate = () => {
    setIsTranslated(true); // Toggle translation state
    setDirection('left'); // Always set the direction to left when clicking on About or Contact Us
  }; 
  const handleGoHome = () => {
    setIsTranslated(true); // Set translation state to true
  setDirection('right'); // Always set the direction to right when clicking on Home
  };
  return (
    <Router>
      <div className="App">
      {/* Violet horizontal bar at the top */}

      <div className="violet-horizontal-bar">
        {/* Buttons */}
        <Link to="/" className="how-to-use-button" onClick={handleGoHome}>Home Page</Link>
        <Link to="/about" className="about-button" onClick={handleTranslate}>About</Link>
        <Link to="/contact" className="contact-us-button" onClick={handleTranslate}>Contact Us</Link>
        </div>

        <header className="App-header">
          <img 
          src={getLogoPath('png')} 
          alt="Logo" 
          className={`App-logo ${isTranslated ? `translate-${direction}` : ''}`} />
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

      {/* Violet horizontal bar at the bottom */}
      <div className="violet-horizontal-bar"></div>
      </div>
    </Router>
  );
}


export default App;
