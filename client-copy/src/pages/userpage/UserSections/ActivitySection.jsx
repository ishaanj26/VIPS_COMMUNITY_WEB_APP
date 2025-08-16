
import React from 'react';

const activities = [
  {
    type: 'post',
    title: 'Shared a new project on GitHub',
    date: 'Aug 10, 2025',
    status: 'Published',
    icon: '📝',
  },
  {
    type: 'event',
    title: 'Attended React Summit',
    date: 'Aug 2, 2025',
    status: 'Completed',
    icon: '🎉',
  },
  {
    type: 'group',
    title: 'Joined Coding Club',
    date: 'Jul 28, 2025',
    status: 'Active',
    icon: '👥',
  },
];

const ActivitySection = () => (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
    <div className="space-y-4">
      {activities.map((activity, idx) => (
        <div key={idx} className="flex items-center gap-4 bg-white rounded-lg shadow p-4">
          <span className="text-3xl">{activity.icon}</span>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{activity.title}</div>
            <div className="text-xs text-gray-500">{activity.date}</div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${activity.status === 'Published' ? 'bg-blue-100 text-blue-700' : activity.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{activity.status}</span>
        </div>
      ))}
    </div>
  </div>
);

export default ActivitySection;
