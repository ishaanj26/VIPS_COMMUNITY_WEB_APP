import React from "react";
import Button from "../../../components/Button";
import {
  User, Image, Lock, Shield, Bell, Eye, Globe, Users, MessageCircle,
  Trash2, LogOut, Download, Calendar, CreditCard, Moon, History, 
  Bookmark, Settings
} from "lucide-react";

const settingsData = [
  {
    section: "Profile",
    items: [
      { icon: User, title: "Edit Profile", description: "Edit your name, bio, skills, and interests", action: "Edit" },
      { icon: Image, title: "Change Profile Picture", description: "Upload or update your profile and cover images", action: "Change" }
    ]
  },
  {
    section: "Account & Security", 
    items: [
      { icon: Lock, title: "Change Password", description: "Update your password for security", action: "Update" },
      { icon: Shield, title: "Two-Factor Authentication", description: "Add an extra layer of security to your account", action: "Enable" },
      { icon: History, title: "Login Activity", description: "View recent logins and sessions", action: "View" },
      { icon: Trash2, title: "Delete Account", description: "Permanently remove your account and data", action: "Delete" }
    ]
  },
  {
    section: "Community Preferences",
    items: [
      { icon: Users, title: "Manage Connections", description: "View or remove your friends and followers", action: "Manage" },
      { icon: MessageCircle, title: "Messaging Preferences", description: "Control who can message you", action: "Edit" },
      { icon: MessageCircle, title: "Blocked Users", description: "View and manage blocked accounts", action: "Manage" },
      { icon: Bookmark, title: "Saved Posts", description: "View and manage your saved posts", action: "View" },
      { icon: Globe, title: "Language & Region", description: "Set your preferred language and region", action: "Change" }
    ]
  },
  {
    section: "Notifications",
    items: [
      { icon: Bell, title: "Notification Settings", description: "Customize how you receive notifications", action: "Configure" },
      { icon: Calendar, title: "Event Reminders", description: "Manage reminders for upcoming events", action: "Edit" }
    ]
  },
  {
    section: "Privacy",
    items: [
      { icon: Eye, title: "Profile Visibility", description: "Control who can see your profile and activity", action: "Manage" },
      { icon: Download, title: "Download Your Data", description: "Request a copy of all your account data", action: "Download" }
    ]
  },
  {
    section: "Subscription & Payments",
    items: [
      { icon: CreditCard, title: "Manage Subscription", description: "Upgrade, downgrade, or cancel your VIP plan", action: "Manage" },
      { icon: History, title: "Payment History", description: "View your previous payments and invoices", action: "View" }
    ]
  },
  {
    section: "Appearance",
    items: [
      { icon: Moon, title: "Dark Mode", description: "Toggle between light and dark themes", action: "Toggle" }
    ]
  },
  {
    section: "Miscellaneous",
    items: [
      { icon: Settings, title: "General Preferences", description: "App theme, feed preferences, and layout options", action: "Edit" },
      { icon: LogOut, title: "Logout", description: "Sign out of your account", action: "Logout" }
    ]
  }
];

export default function SettingsSection() {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b bg-gray-100">
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-gray-600 text-xs">
            Manage your account, preferences, and community interactions
          </p>
        </div>

        <div className="divide-y">
          {settingsData.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="px-6 py-2 bg-gray-50 border-t border-b">
                <h3 className="text-sm font-semibold text-gray-700">{section.section}</h3>
              </div>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-all duration-300 hover:shadow-sm">
                  <span className="bg-gray-100 text-gray-700 rounded-full p-2 transition-transform duration-300 hover:scale-110">
                    <item.icon size={18} />
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                  <Button className="bg-slate-600 text-white px-3 py-1 rounded-md text-xs transition duration-300 hover:bg-slate-700 hover:scale-105">
                    {item.action}
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}