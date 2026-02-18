import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import apiRequest, { getAuthToken, removeAuthToken } from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const publicUrl = process.env.PUBLIC_URL || '';

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const userData = await apiRequest('/auth/me/');
        setUser(userData);
      } catch (err) {
        setError(err.message || 'Ошибка при загрузке данных');
        if (err.message.includes('401') || err.message.includes('токен')) {
          removeAuthToken();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    removeAuthToken();
    navigate('/');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <section className="dashboard-section" style={{ backgroundImage: `url(${publicUrl}/background_1.png)` }}>
          <div className="dashboard-background"></div>
          <div className="dashboard-container">
            <div className="loading-spinner">Загрузка...</div>
          </div>
        </section>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="dashboard-page">
        <section className="dashboard-section" style={{ backgroundImage: `url(${publicUrl}/background_1.png)` }}>
          <div className="dashboard-background"></div>
          <div className="dashboard-container">
            <div className="error-message">{error}</div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-section" style={{ backgroundImage: `url(${publicUrl}/background_1.png)` }}>
        <div className="dashboard-background"></div>
        <div className="dashboard-container">
          <ScrollReveal animation="fadeUp">
            <div className="dashboard-box">
              <div className="dashboard-header">
                <h1 className="dashboard-title">Личный кабинет</h1>
                <button onClick={handleLogout} className="logout-button">
                  Выйти
                </button>
              </div>

              {error && <div className="error-message" style={{ color: '#ff4444', marginBottom: '20px' }}>{error}</div>}

              {user && (
                <div className="dashboard-content">
                  <div className="user-info-card">
                    <div className="user-avatar">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div className="user-details">
                      <h2 className="user-name">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : user.username}
                      </h2>
                      <p className="user-username">@{user.username}</p>
                      <p className="user-email">{user.email}</p>
                      <div className="user-status">
                        <span className={`status-badge ${user.is_email_verified ? 'verified' : 'unverified'}`}>
                          {user.is_email_verified ? '✓ Email подтвержден' : '✗ Email не подтвержден'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-stats">
                    <div className="stat-card">
                      <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                      </div>
                      <div className="stat-content">
                        <h3 className="stat-title">Дата регистрации</h3>
                        <p className="stat-value">
                          {new Date(user.date_joined).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-actions">
                    <h3 className="actions-title">Быстрые действия</h3>
                    <div className="actions-grid">
                      <button className="action-button" onClick={() => navigate('/shop')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                        <span>Магазин</span>
                      </button>
                      <button className="action-button" onClick={() => navigate('/')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                        <span>Главная</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
