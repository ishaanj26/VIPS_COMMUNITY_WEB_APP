
import React, { useState, useEffect } from 'react';
import Button from '../../../../../components/Button';

const EditProfile = ({ setModalOpen, user, setUser }) => {
  const [profileData, setProfileData] = useState({ bio: "", skills: [], interests: [], courseTitle: "", title: "" });
  const [skillsInput, setSkillsInput] = useState("");
  const [interestsInput, setInterestsInput] = useState("");
  const [courseTitleInput, setCourseTitleInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProfileData({
      bio: user?.bio || "",
      skills: Array.isArray(user?.skills) ? user.skills : (user?.skills ? [user.skills] : []),
      interests: Array.isArray(user?.interests) ? user.interests : (user?.interests ? [user.interests] : []),
      courseTitle: user?.courseTitle || "",
      title: user?.title || ""
    });
    setSkillsInput(Array.isArray(user?.skills) ? user.skills.join(", ") : (user?.skills || ""));
    setInterestsInput(Array.isArray(user?.interests) ? user.interests.join(", ") : (user?.interests || ""));
    setCourseTitleInput(user?.courseTitle || "");
    setTitleInput(user?.title || "");
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updatedProfile = {
      id: user?.id,
      ...profileData,
      skills: skillsInput.split(",").map(s => s.trim()).filter(Boolean),
      interests: interestsInput.split(",").map(i => i.trim()).filter(Boolean),
      courseTitle: courseTitleInput,
      title: titleInput
    };
    try {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/edit-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile)
      });
      // Update user context with new profile data
      setUser(prev => ({
        ...prev,
        bio: updatedProfile.bio,
        skills: updatedProfile.skills,
        interests: updatedProfile.interests,
        courseTitle: updatedProfile.courseTitle,
        title: updatedProfile.title
      }));
      setModalOpen(false);
    } catch {
      // handle error
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)', background: 'rgba(30,30,30,0.25)' }}>
      <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-xl shadow-xl p-4 w-full max-w-sm relative animate-fadeIn border border-gray-200">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={() => setModalOpen(false)}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-extrabold mb-4 text-gray-800 text-center">Edit Profile</h3>
        {loading ? (
          <div className="text-center py-8 text-lg text-gray-500">Loading...</div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Bio</label>
              <textarea
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white bg-opacity-90"
                value={profileData.bio}
                onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Skills</label>
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white bg-opacity-90"
                value={skillsInput}
                onChange={e => setSkillsInput(e.target.value)}
                placeholder="e.g. JavaScript, React, Node.js"
              />
              <span className="text-xs text-gray-400">Comma separated</span>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Interests</label>
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white bg-opacity-90"
                value={interestsInput}
                onChange={e => setInterestsInput(e.target.value)}
                placeholder="e.g. Coding, Music, Sports"
              />
              <span className="text-xs text-gray-400">Comma separated</span>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Course Title</label>
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white bg-opacity-90"
                value={courseTitleInput}
                onChange={e => setCourseTitleInput(e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Title</label>
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white bg-opacity-90"
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                placeholder="e.g. Student, Developer, Designer"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-base shadow-md hover:bg-blue-700 transition"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <button
              type="button"
              className="mt-4 w-full text-gray-600 hover:text-gray-800 transition"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
