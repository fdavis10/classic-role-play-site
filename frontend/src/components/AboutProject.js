import React from 'react';
import './AboutProject.css';

const AboutProject = () => {
  const publicUrl = process.env.PUBLIC_URL || '';
  
  return (
    <section className="about-project" style={{ backgroundImage: `url(${publicUrl}/background_3.png)` }}>
      <div className="dark-overlay"></div>
      <div className="container">
        <h2 className="about-title">Наш проект — глоток свежего (или старого?) воздуха.</h2>
        <div className="about-content">
          <p>
            Мы вернулись к истокам: родные модели GTA, знакомый каждому округ Лос Сантоса и реальность 2020-х.
          </p>
          <p>
            Наша команда предлагает полную свободу действий. Мы подготовили кучу площадок для заядлых рпшников и множество интерактива для фармил и тех кто желает поиграть для души. Правила не ограничивают никого (в разумных пределах).
          </p>
          <p>
            Создавай персонажа, придумывай ему роль и просто кайфуй в той самой приятнейшей атмосфере. Старый SAMP вернулся, и теперь у нас есть возможность вернуться в те самые времена и снова стать счастливыми. Не упускай свой шанс — заходи к нам на огонёк.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutProject;
