// src/components/RedirectPage.js
import React, { useEffect, useState } from 'react';

const RedirectPage = ({ imageUrl }) => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const processImage = async () => {
      try {
        const formData = new FormData();
        formData.append('image', imageUrl);
    
        const response = await fetch('http://localhost:5000/api/get_food_data', {
          method: 'POST',
          body: formData,
        });
    
        if (response.ok) {
          const data = await response.json();
          setResult(data.nutritional_info || ''); // Ensure nutritional_info is available or provide a default value
        } else {
          console.error('Error processing image:', response.statusText);
        }
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
      {result && <p>Nutritional Info: {result}</p>}
    </div>
  );
};

export default RedirectPage;
