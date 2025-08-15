import React from 'react'
import Button from '../../../../../components/Button'
import { useState } from 'react';

const ChangePassword = ({ setModalOpen,user }) => {
    const [passwordError, setPasswordError] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (!newPassword || !confirmPassword) {
        setPasswordError("Please fill in both fields.");
        return;
    }
    if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
    }
    try {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user?.email, password: newPassword })
        });
        setModalOpen(false);
    } catch {
        setPasswordError("Failed to change password. Try again.");
    }
};
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)', background: 'rgba(30,30,30,0.25)' }}>
            <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-xl shadow-xl p-4 w-full max-w-xs relative animate-fadeIn border border-gray-200" style={{ boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.25)' }}>
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                    onClick={() => setModalOpen(false)}
                    aria-label="Close"
                >
                    &times;
                </button>
                <h3 className="text-lg font-extrabold mb-4 text-gray-800 text-center">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">New Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white bg-opacity-90"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white bg-opacity-90"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                        />
                    </div>
                    {passwordError && <div className="text-xs text-red-500 text-center">{passwordError}</div>}
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-base shadow-md hover:bg-blue-700 transition"
                    >
                        Change Password
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword
