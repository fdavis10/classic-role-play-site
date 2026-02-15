import React from 'react';
import './BackgroundSections.css';

const BackgroundSections = () => {
  const publicUrl = process.env.PUBLIC_URL || '';
  
  return (
    <div className="background-wrapper">
      <div 
        className="background-section bg-1"
        style={{ backgroundImage: `url(${publicUrl}/background_1.png)` }}
      ></div>
      <div 
        className="background-section bg-2"
        style={{ backgroundImage: `url(${publicUrl}/background_2.png)` }}
      ></div>
      <div 
        className="background-section bg-3"
        style={{ backgroundImage: `url(${publicUrl}/background_3.png)` }}
      ></div>
    </div>
  );
};

export default BackgroundSections;
