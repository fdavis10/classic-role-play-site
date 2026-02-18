import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const publicUrl = process.env.PUBLIC_URL || '';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
  };

  return (
    <div className="login-page">
      <section className="login-section" style={{ backgroundImage: `url(${publicUrl}/background_1.png)` }}>
        <div className="login-background"></div>
        <div className="login-container">
          <ScrollReveal animation="fadeUp">
            <div className="login-box">
              <h1 className="login-title">Авторизация</h1>
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
                <button type="submit" className="login-button">
                  Авторизоваться
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Login;
