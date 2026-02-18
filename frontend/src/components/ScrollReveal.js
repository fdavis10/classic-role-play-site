import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import './ScrollReveal.css';

const ScrollReveal = ({ children, animation = 'fadeUp', delay = 0, duration = 0.6 }) => {
  const [ref, isVisible] = useScrollAnimation({ once: true });

  return (
    <div
      ref={ref}
      className={`scroll-reveal scroll-reveal-${animation} ${isVisible ? 'scroll-reveal-visible' : ''}`}
      style={{
        transitionDelay: `${delay}s`,
        transitionDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
