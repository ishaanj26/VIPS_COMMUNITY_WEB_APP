
import React from 'react';

const events = [
  { name: 'React Summit', date: 'Aug 20, 2025' },
  { name: 'Hackathon', date: 'Sep 5, 2025' },
];
const quickLinks = [
  { label: 'Forums', url: '#' },
  { label: 'Events', url: '#' },
  { label: 'Members', url: '#' },
];
const notifications = [
  { message: 'You have 2 new messages', icon: '🔔' },
  { message: 'Event registration confirmed', icon: '✅' },
];

const DashboardSection = () => (
  <div className="max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="font-bold text-lg mb-2">Upcoming Events</div>
        <ul className="space-y-2">
          {events.map((e, idx) => (
            <li key={idx} className="flex justify-between text-gray-700">
              <span>{e.name}</span>
              <span className="text-xs text-gray-400">{e.date}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="font-bold text-lg mb-2">Quick Links</div>
        <div className="flex flex-col gap-2">
          {quickLinks.map((l, idx) => (
            <a key={idx} href={l.url} className="text-blue-600 hover:underline font-medium">{l.label}</a>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🔔</span>
          <span className="font-bold text-lg">Notifications</span>
        </div>
        <ul className="space-y-2">
          {notifications.map((n, idx) => (
            <li key={idx} className="flex items-center gap-2 text-gray-700">
              <span>{n.icon}</span>
              <span>{n.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default DashboardSection;
