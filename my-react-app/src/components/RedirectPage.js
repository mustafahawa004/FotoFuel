// src/components/RedirectPage.js
import React, { useEffect, useState } from 'react';

const RedirectPage = ({ imageUrl }) => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const processImage = async () => {
      try {
        const response = await fetch('http://localhost:5000/process_image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image_url: imageUrl }),
        });

        const data = await response.json();
        setResult(data.result);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    };

    processImage();
  }, [imageUrl]);

  return (
    <div>
      <h2>Redirect Page</h2>
      <img src={imageUrl} alt="Redirected Image" style={{ width: '300px', height: '300px' }} />
      {result && <p>Result from datacollection.py: {result}</p>}
    </div>
  );
};

export default RedirectPage;
