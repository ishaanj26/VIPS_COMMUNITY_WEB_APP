import React, { useState } from "react";
import { User, Folder, Calendar, Award, Activity } from "lucide-react";

const TABS = [
  { name: "Overview", icon: User },
  { name: "Projects", icon: Folder },
  { name: "Events", icon: Calendar },
  { name: "Achievements", icon: Award },
  { name: "Activity", icon: Activity },
];

export default function ProfileSection() {
  const [activeTab, setActiveTab] = useState("Overview");

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div className="p-6 space-y-6">
            {/* Bio */}
            <section>
              <h2 className="text-lg font-semibold mb-1">Bio</h2>
              <p className="text-gray-600">
                Passionate web developer & CSE student at VIPS. Loves building
                community-driven platforms and exploring emerging tech.
              </p>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-lg font-semibold mb-1">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {["React", "Node.js", "MongoDB", "Tailwind CSS", "Flutter"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Interests */}
            <section>
              <h2 className="text-lg font-semibold mb-1">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {["Hackathons", "Music", "UI Design", "AI", "Community Events"].map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </section>

            {/* Connections */}
            <section>
              <h2 className="text-lg font-semibold mb-1">Connections</h2>
              <p className="text-gray-600">You have <span className="font-semibold">128</span> connections in the VIPS community.</p>
            </section>
          </div>
        );

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
        <p className="text-gray-500">B.Tech CSE | Web Developer</p>
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
