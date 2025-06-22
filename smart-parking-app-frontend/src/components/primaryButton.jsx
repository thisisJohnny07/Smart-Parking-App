import React from 'react';

const PrimaryButton = ({ children, type = 'button', onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-gray-900 text-white py-2 mt-4 rounded-md hover:bg-gray-800 transition"
    >
      {children}
    </button>
  );
};

export default PrimaryButton;