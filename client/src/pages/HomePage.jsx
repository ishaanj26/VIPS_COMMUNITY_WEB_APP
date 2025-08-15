import React from 'react';
import Announcements from '../components/Announcements';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center mt-12">
      <h1 className="text-4xl font-bold mb-4">Welcome to VIPS Community Web App</h1>
      <p className="text-lg text-gray-700 mb-6">This is the homepage. Start building your community here!</p>
      <Announcements />
    </div>
  );
};

export default HomePage;
