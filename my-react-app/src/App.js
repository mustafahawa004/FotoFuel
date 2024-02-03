// src/App.js
import React from 'react';
import './App.css';
import FileUpload from './components/FileUpload';

const logoPath = '/logo/logo'; // Base path for logo files (update based on your project structure)

const getLogoPath = (fileType) => `${logoPath}.${fileType}`;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={getLogoPath('png')} alt="Logo" className="App-logo" />
        <FileUpload />
      </header>
    </div>
  );
}

export default App;
