import React from 'react';
import { MessageSquare, Users, ArrowRight } from 'lucide-react';

const ForumPreview = () => {
  const featuredTopics = [
    {
      id: 1,
      title: 'Campus Placement Preparation',
      description: 'Share tips, experiences, and resources for upcoming placement season. Connect with alumni and seniors.',
      participants: 156,
      posts: 89,
      category: 'Career',
      categoryColor: 'bg-green-100 text-green-700'
    },
    {
      id: 2,
      title: 'Final Year Project Ideas',
      description: 'Brainstorm and discuss innovative project ideas across different engineering domains.',
      participants: 234,
      posts: 167,
      category: 'Academic',
      categoryColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 3,
      title: 'Tech Stack Discussions',
      description: 'Explore latest technologies, frameworks, and programming languages. Share your learning journey.',
      participants: 189,
      posts: 298,
      category: 'Technology',
      categoryColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: 4,
      title: 'Student Life & Campus Events',
      description: 'Discuss upcoming events, share experiences, and plan group activities with fellow students.',
      participants: 312,
      posts: 445,
      category: 'Social',
      categoryColor: 'bg-orange-100 text-orange-700'
    }
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Discussion Forum</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join vibrant discussions with your peers. Share knowledge, ask questions, and connect with like-minded students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTopics.map((topic) => (
            <div key={topic.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${topic.categoryColor}`}>
                  {topic.category}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                {topic.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {topic.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{topic.participants} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  <span>{topic.posts} posts</span>
                </div>
              </div>
              
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Join Discussion
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
            View All Forum Topics
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumPreview;
