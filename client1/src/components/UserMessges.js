import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getMessages'); // Replace with your endpoint
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">User Messages</h2>
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden mb-6 p-4">
            <p><strong>Name:</strong> {message.name}</p>
            <p><strong>Email:</strong> {message.email}</p>
            <p><strong>Food:</strong> {message.food}</p>
            <p><strong>Message:</strong> {message.message}</p>
          </div>
        ))
      ) : (
        <p>No messages found.</p>
      )}
    </div>
  );
};

export default UserMessages;
