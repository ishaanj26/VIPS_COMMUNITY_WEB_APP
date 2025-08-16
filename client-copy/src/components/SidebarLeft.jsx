import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, MessageSquare, Users, Hash, TrendingUp, Menu, X } from 'lucide-react';

const SidebarLeft = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const quickLinks = [
    { icon: Home, label: 'Feed', href: '/feed' },
    { icon: MessageSquare, label: 'Discussions', href: '/forum' },
    { icon: Users, label: 'Communities', href: '/communities' },
    { icon: Hash, label: 'Tech Talk', href: '/forum/tech' },
    { icon: Hash, label: 'Events', href: '/forum/events' },
    { icon: Hash, label: 'Academic', href: '/forum/academic' },
  ];

  return (
    <>
      {/* Mobile Quick Access Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed left-4 top-20 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-full sticky top-16">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
          <nav className="space-y-2">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <link.icon size={20} />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Forum Categories</h4>
            <div className="space-y-2">
              <Link to="/forum/general" className="block px-3 py-1 text-sm text-gray-600 hover:text-blue-600">General Discussion</Link>
              <Link to="/forum/academic" className="block px-3 py-1 text-sm text-gray-600 hover:text-blue-600">Academic Help</Link>
              <Link to="/forum/projects" className="block px-3 py-1 text-sm text-gray-600 hover:text-blue-600">Project Showcase</Link>
              <Link to="/forum/career" className="block px-3 py-1 text-sm text-gray-600 hover:text-blue-600">Career Guidance</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Mobile */}
      <div className={`lg:hidden fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="space-y-2">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <link.icon size={20} />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Forum Categories</h4>
            <div className="space-y-2">
              <Link to="/forum/general" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-1 text-sm text-gray-600 hover:text-blue-600">General Discussion</Link>
              <Link to="/forum/academic" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-1 text-sm text-gray-600 hover:text-blue-600">Academic Help</Link>
              <Link to="/forum/projects" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-1 text-sm text-gray-600 hover:text-blue-600">Project Showcase</Link>
              <Link to="/forum/career" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-1 text-sm text-gray-600 hover:text-blue-600">Career Guidance</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarLeft;
