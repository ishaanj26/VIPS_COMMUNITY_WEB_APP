import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import {
  User,
  Activity,
  Award,
  Users,
  PieChart,
  Settings,
  LogOut
} from 'lucide-react';

import ProfileSection from './UserSections/ProfileSection';
import ActivitySection from './UserSections/ActivitySection';
import AchievementsSection from './UserSections/AchievementsSection';
import CommunitySection from './UserSections/CommunitySection';
import DashboardSection from './UserSections/DashboardSection';
import SettingsSection from './UserSections/SettingSection/SettingsSection';

const sections = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'achievements', label: 'Achievements', icon: Award },
  { key: 'community', label: 'Community', icon: Users },
  { key: 'dashboard', label: 'Dashboard', icon: PieChart },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const UserPage = () => {
  const { user, setUser } = useContext(UserContext);
  // Get ?section= from URL
  const [activeSection, setActiveSection] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    // Only set if valid section
    if (section && sections.some(s => s.key === section)) {
      return section;
    }
    return 'profile';
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your profile.</h2>
      </div>
    );
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("userId");
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <ProfileSection user={user} setActiveSection={setActiveSection} />;
      case 'activity': return <ActivitySection />;
      case 'achievements': return <AchievementsSection />;
      case 'community': return <CommunitySection />;
      case 'dashboard': return <DashboardSection />;
      case 'settings': return <SettingsSection />;
      default: return <ProfileSection user={user} />;
    }
  };

  return (
    <div className="flex max-w-full mx-auto mt-0 min-h-screen bg-gray-50">
      
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col border-r border-gray-800 h-screen fixed">
        {/* User Info */}
        <div className="flex flex-col items-center py-6 border-b border-gray-800">
          <span className="w-14 h-14 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center text-xl font-bold mb-2">
            {user.name[0]}
          </span>
          <div className="text-sm font-medium">{user.name}</div>
          <div className="text-gray-400 text-xs">{user.email}</div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col border-b border-gray-800">
          {sections.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`relative flex items-center px-4 py-3 text-sm transition-colors ${
                activeSection === key
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {/* Blue bar indicator */}
              {activeSection === key && (
                <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r"></span>
              )}
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-56 ">{renderSection()}</main>
    </div>
  );
};

export default UserPage;
