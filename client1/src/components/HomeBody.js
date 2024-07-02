import React from 'react';
import partnerAppImage from '../images/contact1.png'; // Replace with your image path
import webDashboardImage from '../images/contact5.webp'; // Replace with your image path
import apiIntegrationImage from '../images/contact6.webp'; // Replace with your image path

const HomeBody = () => {
  const features = [
    {
      id: 1,
      title: 'Restaurant Partner App',
      description: 'Manage all your orders on your smartphone with our Android app.Integrate with Amazon, eBay, Etsy, and Shopify and manage all of your online orders in a single platform. Set a reorder point and get updates on your stock level to avoid out-of-stock situations.',
      image: partnerAppImage,
      alt: 'Restaurant Partner App'
    },
    {
      id: 2,
      title: 'Restaurant Partner Web Dashboard',
      description: 'Manage all your orders on your desktop or laptop. Our organization has until now just used a Notion table to log who has what IT equipment. With the company growing this is starting to get quite slow and obnoxious to work with.',
      image: webDashboardImage,
      alt: 'Restaurant Partner Web Dashboard'
    },
    {
      id: 3,
      title: 'API Integration',
      description: 'Manage all your orders on your existing Point of Sale (POS) or third-party software.Explore the aspects of API and eCommerce API integration. API or Application Programming Interface is a mechanism that allows the phone.',
      image: apiIntegrationImage,
      alt: 'API Integration'
    }
  ];

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">What do you get on sign-up</h1>
          <p className="text-lg text-center mb-16 max-w-2xl">
            Zomato Partner Platform helps you take your business to new heights instantly with no hassle and 100% transparency!
          </p>
        </div>
        <div className="max-w-5xl mx-auto space-y-20">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`flex flex-col md:flex-row ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''} items-center`}
            >
              <div className="w-full md:w-1/2 h-64 md:h-80 relative">
                <img
                  className="w-full h-full object-cover rounded-lg shadow-md"
                  src={feature.image}
                  alt={feature.alt}
                />
              </div>
              <div className="mt-4 md:mt-0 md:w-1/2 md:px-6">
                <h2 className="text-xl font-bold mb-2">{feature.title}</h2>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default HomeBody;
