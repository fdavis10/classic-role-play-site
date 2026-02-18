import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import apiRequest from '../utils/api';
import './Login.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const publicUrl = process.env.PUBLIC_URL || '';

  useEffect(() => {
    let isMounted = true;
    let hasSucceeded = false;
    
    const verifyEmail = async () => {
      if (!token) {
        if (isMounted) {
          setStatus('error');
          setMessage('Неверная ссылка подтверждения');
        }
        return;
      }

      try {
        const response = await apiRequest(`/auth/verify-email/${token}/`, {
          method: 'GET',
        });
        if (isMounted && !hasSucceeded) {
          hasSucceeded = true;
          setStatus('success');
          setMessage(response.message || 'Email успешно подтвержден!');
        }
      } catch (err) {
        if (isMounted && !hasSucceeded) {
          const errorMessage = err.message || 'Ошибка при подтверждении email';
          if (errorMessage.includes('уже использован') || errorMessage.includes('уже подтвержден')) {
            setStatus('success');
            setMessage('Email уже был подтвержден. Вы можете войти в систему.');
          } else {
            setStatus('error');
            setMessage(errorMessage);
          }
        }
      }
    };

    verifyEmail();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="login-page">
      <section className="login-section" style={{ backgroundImage: `url(${publicUrl}/background_1.png)` }}>
        <div className="login-background"></div>
        <div className="login-container">
          <ScrollReveal animation="fadeUp">
            <div className="login-box">
              <h1 className="login-title">
                {status === 'loading' ? 'Подтверждение email...' : status === 'success' ? 'Успешно!' : 'Ошибка'}
              </h1>
              <p style={{ 
                color: status === 'success' ? '#4caf50' : status === 'error' ? '#ff4444' : '#fff', 
                textAlign: 'center', 
                marginBottom: '20px' 
              }}>
                {message}
              </p>
              {status === 'success' && (
                <Link to="/login" className="login-button" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                  Перейти к авторизации
                </Link>
              )}
              {status === 'error' && (
                <Link to="/register" className="login-button" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                  Зарегистрироваться
                </Link>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default VerifyEmail;
