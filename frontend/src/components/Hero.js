import React from 'react';
import './Hero.css';

const Hero = () => {
  const publicUrl = process.env.PUBLIC_URL || '';
  
  return (
    <section className="hero" style={{ backgroundImage: `url(${publicUrl}/background_1.png)` }}>
      <div className="hero-background"></div>
      <div className="hero-content">
        <div className="hero-logo">
          <h1 className="hero-classic">Classic</h1>
          <h2 className="hero-project">PROJECT</h2>
        </div>
        <h3 className="hero-subtitle">WELCOME HOME.</h3>
        <p className="hero-description">
        SAMP проект возвращающий тебя в старый добрый самп без
мусора в виде кастомных HQ моделей и оставляющий
геймплей.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Начать играть
          </button>
          <button className="btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
            </svg>
            Об игре
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
