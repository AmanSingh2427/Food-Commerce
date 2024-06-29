import React from 'react';
import backgroundImage from '../images/image3.avif'; // Replace with your image path
import backgroundImage2 from '../images/image2.png'; // Replace with your image path

const ImageWithTextOverlay = () => {
  return (
    <div className="relative">
      <img src={backgroundImage} alt="Background" className="w-full h-auto max-h-96" />

      <div className="absolute inset-0 flex items-center justify-center bg-opacity-50">
        <div className="text-white text-center p-4">
          <img src={backgroundImage2} alt="Background" className="w-44 h-auto mx-auto mb-4" />
          {/* <h1 className="text-3xl font-bold mb-2">Zomato</h1> */}
          <h1 className="text-4xl">Discover the best food & drinks in Delhi NCR</h1>
          <p className="text-sm">Zomato is an Indian multinational restaurant aggregator and food delivery company. It was founded by Deepinder Goyal and Pankaj Chaddah in 2008</p>
        </div>
      </div>
    </div>
  );
};

export default ImageWithTextOverlay;
