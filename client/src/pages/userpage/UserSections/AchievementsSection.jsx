
import React from 'react';

const achievements = [
  {
    title: 'Hackathon Winner',
    image: 'https://img.icons8.com/color/96/000000/trophy.png',
    desc: 'Won 1st place at VIPS Hackathon 2025',
    badge: 'Gold',
  },
  {
    title: 'Open Source Contributor',
    image: 'https://img.icons8.com/color/96/000000/source-code.png',
    desc: 'Contributed to ReactJS docs',
    badge: 'Contributor',
  },
  {
    title: 'Workshop Speaker',
    image: 'https://img.icons8.com/color/96/000000/microphone.png',
    desc: 'Spoke at Web Dev Workshop',
    badge: 'Speaker',
  },
];

const AchievementsSection = () => (
  <div className="max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold mb-6">Achievements & Contributions</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {achievements.map((ach, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <img src={ach.image} alt={ach.title} className="w-16 h-16 mb-2" />
          <div className="font-bold text-lg text-gray-900 mb-1">{ach.title}</div>
          <div className="text-gray-600 text-sm mb-2 text-center">{ach.desc}</div>
          <span className="px-3 py-1 rounded-full bg-yellow-200 text-yellow-800 text-xs font-semibold">{ach.badge}</span>
        </div>
      ))}
    </div>
  </div>
);

export default AchievementsSection;
