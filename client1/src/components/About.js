import React from 'react';
import Navbar from './Navbar';
import Footer from '../Footer';
import step1Image from '../images/image1.jpg'; // Replace with your image path
import step2Image from '../images/card4.webp'; // Replace with your image path
import step3Image from '../images/card5.jpeg'; // Replace with your image path

const About = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold mb-8">About Our Website</h1>
        <div className="flex flex-wrap justify-center">
          <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
            <img className="w-full h-48 object-cover" src={step1Image} alt="Step 1" />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Step 1</div>
              <p className="text-gray-700 text-base">
                Create your page on Zomato
                Help users discover your place by creating a listing on Zomato.
              </p>
            </div>
          </div>

          <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
            <img className="w-full h-48 object-cover" src={step2Image} alt="Step 2" />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Step 2</div>
              <p className="text-gray-700 text-base">
                Register for online ordering
                And deliver orders to millions of customers with ease.
              </p>
            </div>
          </div>

          <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
            <img className="w-full h-48 object-cover" src={step3Image} alt="Step 3" />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Step 3</div>
              <p className="text-gray-700 text-base">
                Start receiving orders online
                Manage orders on our partner app, web dashboard or API partners.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
