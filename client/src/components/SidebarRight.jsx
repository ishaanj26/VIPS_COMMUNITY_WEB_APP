import React from 'react';
import { TrendingUp, Users, Clock } from 'lucide-react';

const SidebarRight = () => {
  const trendingDiscussions = [
    { title: 'Tips for Final Exams', replies: 24, time: '2h ago' },
    { title: 'New Campus Library Rules', replies: 18, time: '4h ago' },
    { title: 'VIPS Hackathon 2025', replies: 42, time: '6h ago' },
    { title: 'Study Group for Machine Learning', replies: 15, time: '8h ago' },
    { title: 'Summer Internship Opportunities', replies: 31, time: '12h ago' },
  ];

  const activeMembers = [
    { name: 'Arjun Sharma', avatar: 'AS', status: 'online' },
    { name: 'Priya Patel', avatar: 'PP', status: 'online' },
    { name: 'Rahul Singh', avatar: 'RS', status: 'away' },
    { name: 'Sneha Gupta', avatar: 'SG', status: 'online' },
    { name: 'Vikram Kumar', avatar: 'VK', status: 'online' },
    { name: 'Anita Verma', avatar: 'AV', status: 'away' },
  ];

  return (
    <div className="hidden xl:block w-80 bg-white border-l border-gray-200 h-full sticky top-16">
      <div className="p-4 space-y-6">
        {/* Trending Discussions */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Trending Discussions</h3>
          </div>
          <div className="space-y-3">
            {trendingDiscussions.map((discussion, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{discussion.title}</h4>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>{discussion.replies} replies</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {discussion.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Members */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-green-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Active Members</h3>
          </div>
          <div className="space-y-3">
            {activeMembers.map((member, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {member.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    member.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{member.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
          <h4 className="font-semibold mb-2">Community Stats</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Members</span>
              <span className="font-medium">2,847</span>
            </div>
            <div className="flex justify-between">
              <span>Active Today</span>
              <span className="font-medium">342</span>
            </div>
            <div className="flex justify-between">
              <span>Posts This Week</span>
              <span className="font-medium">156</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
