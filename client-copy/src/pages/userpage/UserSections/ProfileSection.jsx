import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { User, Folder, Calendar, Award, Activity, Heart } from "lucide-react";

const TABS = [
  { name: "Overview", icon: User },
  { name: "Projects", icon: Folder },
  { name: "Events", icon: Calendar },
  { name: "Achievements", icon: Award },
  { name: "Activity", icon: Activity },
  { name: "Liked Items", icon: Heart },
];

export default function ProfileSection({user,setActiveSection}) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [likedItems, setLikedItems] = useState([]);
  const [loadingLikedItems, setLoadingLikedItems] = useState(false);

  // Fetch liked items when Liked Items tab is selected
  useEffect(() => {
    if (activeTab === "Liked Items" && user._id) {
      fetchLikedItems();
    }
  }, [activeTab, user._id]);

  const fetchLikedItems = async () => {
    try {
      setLoadingLikedItems(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/user/liked-items?userId=${user._id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setLikedItems(data.likedItems);
      }
    } catch (error) {
      console.error('Error fetching liked items:', error);
    } finally {
      setLoadingLikedItems(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div className="p-6 space-y-6">
            {/* Bio */}
            <section>
              <h2 className="text-lg font-semibold mb-1">Bio</h2>
              {user.bio && user.bio.trim() ? (
                <p className="text-gray-600">{user.bio}</p>
              ) : (
                <div className="text-gray-400 flex items-center gap-2">
                  <span>No bio added yet.</span>
                  <NavigateSettingsButton />
                </div>
              )}
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-lg font-semibold mb-1">Skills</h2>
              {user.skills && user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 flex items-center gap-2">
                  <span>No skills added yet.</span>
                  <NavigateSettingsButton />
                </div>
              )}
            </section>

            {/* Interests */}
            <section>
              <h2 className="text-lg font-semibold mb-1">Interests</h2>
              {user.interests && user.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 flex items-center gap-2">
                  <span>No interests added yet.</span>
                  <NavigateSettingsButton />
                </div>
              )}
            </section>

            {/* Connections */}
            <section>
              <h2 className="text-lg font-semibold mb-1">Connections</h2>
              <p className="text-gray-600">You have <span className="font-semibold">128</span> connections in the VIPS community.</p>
            </section>
          </div>
        );
// Button to navigate to settings page
function NavigateSettingsButton() {
  const navigate = useNavigate();
  return (
    <button
      className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
      onClick={() => setActiveSection("settings")}
    >
      Edit in Settings
    </button>
  );
}

      case "Projects":
        return <EmptyState message="No projects yet" actionText="Add Project" />;

      case "Events":
        return <EmptyState message="No upcoming events" actionText="Join Event" />;

      case "Achievements":
        return <EmptyState message="No achievements yet" actionText="Add Achievement" />;

      case "Activity":
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <ul className="space-y-3">
              <li className="p-4 border rounded-md shadow-sm bg-white">
                📝 Posted in <strong>Hackathon 2025</strong> discussion.
              </li>
              <li className="p-4 border rounded-md shadow-sm bg-white">
                🎉 Achieved <strong>Top 10 in Web Dev Contest</strong>.
              </li>
              <li className="p-4 border rounded-md shadow-sm bg-white">
                🤝 Connected with <strong>Rishab Verma</strong>.
              </li>
            </ul>
          </div>
        );

      case "Liked Items":
        return (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Liked Items</h2>
            {loadingLikedItems ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading liked items...</p>
              </div>
            ) : likedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {likedItems.map((item) => (
                  <div key={item._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={item.images && item.images.length > 0 ? item.images[0].url || item.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={item.title}
                        className="w-full h-32 object-cover"
                      />
                      {item.isSold && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          SOLD
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-bold text-lg">
                          ₹{item.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.likedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        by {item.sellerName}
                      </p>
                      <a
                        href={`/marketplace/item/${item._id}`}
                        className="block mt-2 bg-blue-600 text-white text-center py-1 px-3 rounded text-xs hover:bg-blue-700 transition-colors"
                      >
                        View Item
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No liked items yet" actionText="Browse Marketplace" />
            )}
          </div>
        );


      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-white shadow rounded-lg overflow-hidden flex flex-col">
      {/* Cover Image */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          className="w-full h-40 object-cover"
          alt="cover"
        />
        <div className="absolute -bottom-12 left-6">
          <img
            src="https://i.pravatar.cc/150?img=32"
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Name + Profile Completion */}
      <div className="pt-14 px-6 pb-4 border-b">
        <h1 className="text-xl font-bold">Ishaan Jain</h1>
       {user.courseTitle && user.title && <p className="text-gray-500">{user.courseTitle} | {user.title}</p>}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Profile Completion</span>
            <span className="text-blue-600">70%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-blue-600 rounded-full w-[70%]"></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-gray-50">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium relative transition 
                ${isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Icon size={16} />
              {tab.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
}

// Reusable empty state
function EmptyState({ message, actionText }) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <p className="text-gray-500 mb-3">{message}</p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        {actionText}
      </button>
    </div>
  );
}
