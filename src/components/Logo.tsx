import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="logo-link">
      <img 
        src="https://raw.githubusercontent.com/Esporadix-team/imagenes_logos/main/esporaLogo.png" 
        alt="Espora Logo" 
        className="w-[40px] h-auto logo-image"
      />
    </div>
  );
};

export default Logo;