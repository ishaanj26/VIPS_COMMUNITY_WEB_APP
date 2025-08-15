import React from 'react';

const Button = ({ children, type = 'button', onClick, className = '', disabled = false, icon, ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${className}`}
      {...props}
    >
      {icon && <span className="inline-block mr-2 align-middle">{icon}</span>}
      <span className="align-middle">{children}</span>
    </button>
  );
};

export default Button;
