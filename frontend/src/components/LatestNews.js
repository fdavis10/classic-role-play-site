import React from 'react';
import './LatestNews.css';

const LatestNews = () => {
  const publicUrl = process.env.PUBLIC_URL || '';
  const news = [
    {
      id: 1,
      title: "Новые работы и маппинг",
      description: "Распланировали больше работ для игроков. Вся инфа в ТГК.",
      link: "t.me/classicrpl",
      date: "15.02.2026",
      image: `${publicUrl}/image_news_board.png`
    },
    {
      id: 2,
      title: "Закончены начальные работы",
      description: "Завершили начальные работы. Видеообзор в нашем ТГК.",
      link: "t.me/classicrpl",
      date: "30.01.2026",
      image: `${publicUrl}/image_news_board_2.png`
    },
    {
      id: 3,
      title: "Новое начало",
      description: "После неудачного открытия в ноябре мы приняли все ошибки и решили закрыться на доработку. Следите за новостями.",
      date: "01.01.2026",
      image: `${publicUrl}/image_news_board_3.png`
    }
  ];

  return (
    <section className="latest-news" style={{ backgroundImage: `url(${publicUrl}/background_2.png)` }}>
      <div className="dark-overlay"></div>
      <div className="container">
        <h2 className="section-title">ПОСЛЕДНИЕ НОВОСТИ</h2>
        <div className="news-grid">
          {news.map((item) => (
            <article key={item.id} className="news-card">
              <div className="news-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="news-content">
                <h3 className="news-title">{item.title}</h3>
                <p className="news-description">{item.description}</p>
                {item.link && (
                  <a href={`https://${item.link}`} className="news-link" target="_blank" rel="noopener noreferrer">
                    {item.link}
                  </a>
                )}
                <div className="news-date">
                  <span>{item.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
