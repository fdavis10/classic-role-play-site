import React from 'react';
import './ImageSection.css';

const ImageSection = () => {
  const publicUrl = process.env.PUBLIC_URL || '';
  
  return (
    <section className="image-section" style={{ backgroundImage: `url(${publicUrl}/background_4.png)` }}>
      <div className="dark-overlay"></div>
    </section>
  );
};

export default ImageSection;
