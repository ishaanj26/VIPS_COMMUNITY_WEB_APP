import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Clock, MoreHorizontal } from 'lucide-react';

const Feed = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: 'Arjun Sharma',
        avatar: 'AS',
        role: 'Computer Science Student'
      },
      content: 'Just finished my final project on Machine Learning! The journey was challenging but incredibly rewarding. Thanks to everyone who helped me along the way 🚀',
      time: '2 hours ago',
      likes: 24,
      comments: 8,
      shares: 3,
      liked: false
    },
    {
      id: 2,
      user: {
        name: 'Priya Patel',
        avatar: 'PP',
        role: 'Electronics Engineering'
      },
      content: 'Excited to announce that our robotics team won first place in the inter-college competition! Proud of our team\'s hard work and dedication. VIPS never fails to amaze! 🏆',
      time: '4 hours ago',
      likes: 56,
      comments: 15,
      shares: 12,
      liked: true
    },
    {
      id: 3,
      user: {
        name: 'Rahul Singh',
        avatar: 'RS',
        role: 'MBA Student'
      },
      content: 'Looking for study partners for the upcoming Marketing Strategy exam. Anyone interested in forming a study group? We can meet at the library this weekend.',
      time: '6 hours ago',
      likes: 12,
      comments: 6,
      shares: 2,
      liked: false
    },
    {
      id: 4,
      user: {
        name: 'Sneha Gupta',
        avatar: 'SG',
        role: 'Placement Officer'
      },
      content: 'Great news! We have secured placement opportunities with top tech companies for this year. Resume review sessions start next week. Don\'t miss out!',
      time: '8 hours ago',
      likes: 89,
      comments: 23,
      shares: 31,
      liked: false
    },
    {
      id: 5,
      user: {
        name: 'Vikram Kumar',
        avatar: 'VK',
        role: 'Information Technology'
      },
      content: 'Check out my latest web development project! Built a full-stack e-commerce platform using React and Node.js. Feedback welcome! Link in bio.',
      time: '12 hours ago',
      likes: 34,
      comments: 11,
      shares: 7,
      liked: true
    }
  ]);

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked, 
            likes: post.liked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Community Feed</h2>
        <p className="text-sm sm:text-base text-gray-600">Stay updated with the latest posts from your community</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Post Header */}
            <div className="p-3 sm:p-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {post.user.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{post.user.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{post.user.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500">{post.time}</span>
                    </div>
                  </div>
                </div>
                <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-full">
                  <MoreHorizontal size={18} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-3 sm:p-4">
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{post.content}</p>
            </div>

            {/* Post Actions */}
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full transition-colors ${
                      post.liked 
                        ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Heart 
                      size={16} 
                      className={post.liked ? 'fill-current' : ''} 
                    />
                    <span className="text-xs sm:text-sm font-medium">{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                    <MessageCircle size={16} />
                    <span className="text-xs sm:text-sm font-medium">{post.comments}</span>
                  </button>
                  
                  <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                    <Share2 size={16} />
                    <span className="text-xs sm:text-sm font-medium">{post.shares}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-6 sm:mt-8">
        <button className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base">
          Load More Posts
        </button>
      </div>
    </div>
  );
};

export default Feed;
