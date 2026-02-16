
import React from 'react';

const IslamicPattern: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="islamic-pattern absolute inset-0"></div>
      {/* Corner Ornaments */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-30 border-t-8 border-r-8 border-[#d4af37] m-4 rounded-tr-3xl"></div>
      <div className="absolute top-0 left-0 w-32 h-32 opacity-30 border-t-8 border-l-8 border-[#d4af37] m-4 rounded-tl-3xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-30 border-b-8 border-r-8 border-[#d4af37] m-4 rounded-br-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-30 border-b-8 border-l-8 border-[#d4af37] m-4 rounded-bl-3xl"></div>
    </div>
  );
};

export default IslamicPattern;
