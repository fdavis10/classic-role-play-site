import React, { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import './LatestNews.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const LatestNews = () => {
  const publicUrl = process.env.PUBLIC_URL || '';
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/news/`);
        if (!response.ok) {
          throw new Error('Ошибка загрузки новостей');
        }
        const data = await response.json();
        const formattedNews = data.results ? data.results : data;
        setNews(formattedNews);
      } catch (err) {
        console.error('Ошибка при загрузке новостей:', err);
        setError(err.message);
        setNews([
          {
            id: 1,
            title: "Новые работы и маппинг",
            description: "Распланировали больше работ для игроков. Вся инфа в ТГК.",
            link: "t.me/classicrpl",
            date: "15.02.2026",
            image: `${publicUrl}/image_news_board.png`
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getImageUrl = (item) => {
    if (item.image_url) {
      return item.image_url;
    }
    if (item.image) {
      return item.image;
    }
    const imageMap = {
      1: `${publicUrl}/image_news_board.png`,
      2: `${publicUrl}/image_news_board_2.png`,
      3: `${publicUrl}/image_news_board_3.png`
    };
    return imageMap[item.id] || `${publicUrl}/image_news_board.png`;
  };

  if (loading) {
    return (
      <section className="latest-news" style={{ backgroundImage: `url(${publicUrl}/background_2.png)` }}>
        <div className="dark-overlay"></div>
        <div className="container">
          <ScrollReveal animation="fadeUp">
            <h2 className="section-title">ПОСЛЕДНИЕ НОВОСТИ</h2>
          </ScrollReveal>
          <div className="news-grid">
            <p style={{ color: '#fff', textAlign: 'center', width: '100%' }}>Загрузка новостей...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && news.length === 0) {
    return (
      <section className="latest-news" style={{ backgroundImage: `url(${publicUrl}/background_2.png)` }}>
        <div className="dark-overlay"></div>
        <div className="container">
          <ScrollReveal animation="fadeUp">
            <h2 className="section-title">ПОСЛЕДНИЕ НОВОСТИ</h2>
          </ScrollReveal>
          <div className="news-grid">
            <p style={{ color: '#fff', textAlign: 'center', width: '100%' }}>Ошибка загрузки новостей: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="latest-news" style={{ backgroundImage: `url(${publicUrl}/background_2.png)` }}>
      <div className="dark-overlay"></div>
      <div className="container">
        <ScrollReveal animation="fadeUp">
          <h2 className="section-title">ПОСЛЕДНИЕ НОВОСТИ</h2>
        </ScrollReveal>
        <div className="news-grid">
          {news.length === 0 ? (
            <p style={{ color: '#fff', textAlign: 'center', width: '100%' }}>Новостей пока нет</p>
          ) : (
            news.map((item, index) => (
              <ScrollReveal key={item.id} animation="fadeUp" delay={index * 0.1}>
                <article className="news-card">
                  <div className="news-image">
                    <img src={getImageUrl(item)} alt={item.title} />
                  </div>
                  <div className="news-content">
                    <h3 className="news-title">{item.title}</h3>
                    <p className="news-description">{item.description}</p>
                    {item.link && (
                      <a href={item.link.startsWith('http') ? item.link : `https://${item.link}`} className="news-link" target="_blank" rel="noopener noreferrer">
                        {item.link.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                    <div className="news-date">
                      <span>{item.date ? formatDate(item.date) : ''}</span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
