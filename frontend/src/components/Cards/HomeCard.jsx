import React from "react";

const HomeCard = ({ img, name, theme, onClick }) => {
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';

  return (
    <div
      className="max-w-sm rounded overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform"
      onClick={onClick}
    >
      <img className="w-[400px] h-[400px] object-cover" src={img} alt={name} />
      <div className="px-6 py-4">
        <div className={`font-bold text-xl mb-2 ${textColor}`}>{name}</div>
      </div>
    </div>
  );
};

export default HomeCard;
