import React from 'react';
import { Users, Camera, Code, Music, BookOpen, ArrowRight } from 'lucide-react';

const CommunitiesPreview = () => {
  const communities = [
    {
      id: 1,
      name: 'Photography Club',
      description: 'Capture moments, share stories, and improve your photography skills with fellow enthusiasts.',
      members: 234,
      image: '/api/placeholder/300/200',
      icon: Camera,
      color: 'from-pink-500 to-orange-500'
    },
    {
      id: 2,
      name: 'Coding Society',
      description: 'Learn, code, and build amazing projects together. From beginners to advanced developers.',
      members: 456,
      image: '/api/placeholder/300/200',
      icon: Code,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 3,
      name: 'Music Group',
      description: 'Express yourself through music. Share your compositions, jam sessions, and musical journey.',
      members: 189,
      image: '/api/placeholder/300/200',
      icon: Music,
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 4,
      name: 'Literary Society',
      description: 'For book lovers, writers, and poetry enthusiasts. Share your thoughts and creative writing.',
      members: 156,
      image: '/api/placeholder/300/200',
      icon: BookOpen,
      color: 'from-yellow-500 to-red-500'
    },
    {
      id: 5,
      name: 'Entrepreneurship Cell',
      description: 'Turn your ideas into reality. Network with aspiring entrepreneurs and industry mentors.',
      members: 298,
      image: '/api/placeholder/300/200',
      icon: Users,
      color: 'from-indigo-500 to-pink-500'
    },
    {
      id: 6,
      name: 'Sports Club',
      description: 'Stay fit, play together, and participate in inter-college sports competitions.',
      members: 412,
      image: '/api/placeholder/300/200',
      icon: Users,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Communities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join diverse communities based on your interests and passions. Connect with students who share your hobbies and goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <div key={community.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Community Header with Gradient */}
              <div className={`h-32 bg-gradient-to-r ${community.color} flex items-center justify-center`}>
                <community.icon size={48} className="text-white" />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{community.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users size={16} />
                    <span>{community.members}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {community.description}
                </p>

                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  View Community
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Member Avatars Preview */}
              <div className="px-6 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center text-white text-xs font-medium"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">and {community.members - 4} others</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
            Explore All Communities
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunitiesPreview;
