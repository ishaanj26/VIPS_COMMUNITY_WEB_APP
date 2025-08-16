import React from 'react';
import { useParams } from 'react-router-dom';

const MemberProfile = () => {
  const { memberId } = useParams();
  return (
    <div className="flex flex-col items-center mt-12">
      <h2 className="text-3xl font-bold mb-4">Member Profile</h2>
      <p className="text-lg text-gray-700">Details for member ID: <span className="font-mono">{memberId}</span></p>
      <p className="text-gray-500">Profile info will be displayed here.</p>
    </div>
  );
};

export default MemberProfile;
