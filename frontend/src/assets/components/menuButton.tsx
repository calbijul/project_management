import React from "react";

const MenuButton: React.FC<{ 
  onClick: () => void; 
  className?: string 
}> = ({ onClick, className }) => {
  return (
    <button 
      onClick={onClick}
      className={`${className} inline-flex items-center p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-opacity duration-300`}
    >
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 6h16M4 12h16M4 18h16" 
        />
      </svg>
    </button>
  );
};

export default MenuButton;