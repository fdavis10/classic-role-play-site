import React from 'react';
import ScrollReveal from './ScrollReveal';
import './Placeholder.css';

const Placeholder = () => {
  const publicUrl = process.env.PUBLIC_URL || '';
  
  return (
    <section className="placeholder-section">
      <div className="container">
        <ScrollReveal animation="fadeUp">
          <div className="placeholder-box">
            <div className="placeholder-top">
              <img 
                src={`${publicUrl}/image_news.png`}
                alt="News"
                className="placeholder-image"
              />
            </div>
            <div className="placeholder-bottom">
              <p>Информацию ожидаем</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Placeholder;
