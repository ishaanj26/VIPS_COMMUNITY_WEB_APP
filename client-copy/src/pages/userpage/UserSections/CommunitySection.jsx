
import React from 'react';
import Button from '../../../components/Button';

const followers = [
  { name: 'Amit', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Priya', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Rahul', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
];
const interactions = [
  { type: 'like', user: 'Priya', post: 'React Summit', icon: '👍' },
  { type: 'comment', user: 'Amit', post: 'Hackathon', icon: '💬' },
];

const CommunitySection = () => (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-6">Community Interaction</h2>
    <Button className="bg-green-600 text-white mb-4 hover:bg-green-700 transition">Connect</Button>
    <div className="mb-6">
      <div className="font-semibold mb-2">Followers</div>
      <div className="flex gap-4">
        {followers.map((f, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <img src={f.avatar} alt={f.name} className="w-12 h-12 rounded-full shadow" />
            <span className="text-xs mt-1 text-gray-700">{f.name}</span>
          </div>
        ))}
      </div>
    </div>
    <div>
      <div className="font-semibold mb-2">Recent Interactions</div>
      <div className="space-y-2">
        {interactions.map((i, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-white rounded shadow p-2">
            <span className="text-xl">{i.icon}</span>
            <span className="font-medium text-gray-800">{i.user}</span>
            <span className="text-gray-500 text-xs">{i.type === 'like' ? 'liked' : 'commented on'}</span>
            <span className="font-semibold text-blue-600">{i.post}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CommunitySection;
