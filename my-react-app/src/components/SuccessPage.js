import React, { useState, useEffect } from 'react';

function SuccessPage() {
  const [foodItem, setFoodItem] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [nutritionalInfo, setNutritionalInfo] = useState('');

  useEffect(() => {
    fetchFoodData(); // Call the function to fetch food data
  }, []);

  const fetchFoodData = async () => {
    try {
      // Make an API request to your backend to get the food data
      const response = await fetch('http://localhost:5000/api/get_food_data'); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setFoodItem(data.food_item || ''); // Ensure food_item is available or provide a default value
        setNutritionalInfo(JSON.stringify(data.nutrition_data || {})); // Convert nutrition_data to string for display
      // Fetch the image separately using the provided file path
        if (data.image_src) {
        const imageResponse = await fetch(`http://localhost:5000/${data.image_src}`);
        if (imageResponse.ok) {
          const blob = await imageResponse.blob();
          setImageSrc(URL.createObjectURL(blob));
        } else {
          // Handle error fetching image
          console.error('Error fetching image:', imageResponse.statusText);
        }
      } else {
        // Handle case where image source is not provided
        console.error('Image source not provided in response data');
      }
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
        <h2>{foodItem}</h2>
        <div className="nutritional-info">
          <h3>Nutritional Information</h3>
          <p>{nutritionalInfo}</p>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
