import React, { useState, useEffect } from 'react';

function SuccessPage() {
  const [foodName, setFoodName] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [nutritionalInfo, setNutritionalInfo] = useState('');

  useEffect(() => {
    fetchFoodData(); // Call the function to fetch food data
  }, []);

  const fetchFoodData = async () => {
    try {
      // Make an API request to your backend to get the food data
      const response = await fetch('/api/get_food_data'); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setFoodName(data.foodName);
        setImageSrc(data.imageSrc);
        setNutritionalInfo(data.nutritionalInfo);
      } else {
        // Handle error
        console.error('Error fetching food data:', response.statusText);
      }
    } catch (error) {
      // Handle error
      console.error('Error fetching food data:', error.message);
    }
  };

  return (
    <div className="success-page">
      <div className="food-image">
        <img src={imageSrc} alt="Food" />
      </div>
      <div className="food-details">
        <h2>{foodName}</h2>
        <div className="nutritional-info">
          <h3>Nutritional Information</h3>
          <p>{nutritionalInfo}</p>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
