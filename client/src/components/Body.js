import React from 'react';
import backgroundImage from '../images/image1.jpg'; // Replace with your image path

const ImageWithTextOverlay = () => {
  return (
    <div className="relative">
      <img src={backgroundImage} alt="Background" className="w-full h-auto max-h-96" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-50 p-4 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Zomato</h1>
          <p className="text-2xl">Discover the best food & drinks in Delhi NCR</p>
          <p className="text-sm">Zomato is an Indian multinational restaurant aggregator and food delivery company. It was founded by Deepinder Goyal and Pankaj Chaddah in 2008</p>
        </div>
      </div>
    </div>
  );
};

export default ImageWithTextOverlay;
