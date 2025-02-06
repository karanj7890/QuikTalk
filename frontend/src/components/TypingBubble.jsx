import React from 'react';

const TypingBubble = () => {
  return (
    <div className="flex items-center my-2">
      <div className="flex items-center justify-center w-10 h-5 bg-gray-300 rounded-full p-1">
        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mx-0.5 animate-blink"></div>
        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mx-0.5 animate-blink delay-200"></div>
        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mx-0.5 animate-blink delay-400"></div>
      </div>
    </div>
  );
};

export default TypingBubble;