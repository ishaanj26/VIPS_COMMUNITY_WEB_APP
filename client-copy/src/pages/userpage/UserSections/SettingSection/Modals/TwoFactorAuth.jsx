import React from "react";
import Button from "../../../../../components/Button";

export default function TwoFactorAuth({ setModalOpen }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)', background: 'rgba(30,30,30,0.25)' }}>
      <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-xl shadow-xl p-4 w-full max-w-xs relative animate-fadeIn border border-gray-200">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={() => setModalOpen(false)}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-lg font-extrabold mb-4 text-gray-800 text-center">Two-Factor Authentication</h3>
        {/* Add 2FA logic here */}
        <Button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-base shadow-md hover:bg-blue-700 transition">Enable 2FA</Button>
      </div>
    </div>
  );
}
