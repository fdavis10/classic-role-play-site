import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import apiRequest, { setAuthToken } from '../utils/api';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const publicUrl = process.env.PUBLIC_URL || '';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiRequest('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });
      
      setAuthToken(response.access, response.refresh);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Ошибка при авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-section" style={{ backgroundImage: `url(${publicUrl}/background_1.png)` }}>
        <div className="login-background"></div>
        <div className="login-container">
          <ScrollReveal animation="fadeUp">
            <div className="login-box">
              <h1 className="login-title">Авторизация</h1>
              {error && <div className="error-message" style={{ color: '#ff4444', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Логин</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Введите ваш логин"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Пароль</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Введите ваш пароль"
                    required
                  />
                </div>
                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="custom-checkbox"
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">Запомнить меня</span>
                  </label>
                  <a href="#" className="forgot-password">Забыли пароль?</a>
                </div>
                <button type="submit" className="login-button" disabled={loading}>
                  {loading ? 'Вход...' : 'Авторизоваться'}
                </button>
                <p style={{ color: '#fff', textAlign: 'center', marginTop: '15px' }}>
                  Нет аккаунта? <Link to="/register" style={{ color: '#4a90e2' }}>Зарегистрироваться</Link>
                </p>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Login;
