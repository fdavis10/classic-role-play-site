import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import apiRequest from '../utils/api';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const publicUrl = process.env.PUBLIC_URL || '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.password2) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).join(', ');
          setError(errorMessages);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError(data.message || 'Ошибка при регистрации');
        }
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Ошибка при регистрации. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <section className="login-section" style={{ backgroundImage: `url(${publicUrl}/background_1.png)` }}>
          <div className="login-background"></div>
          <div className="login-container">
            <ScrollReveal animation="fadeUp">
              <div className="login-box">
                <h1 className="login-title">Регистрация успешна!</h1>
                <p style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>
                  Мы отправили письмо с подтверждением на ваш email адрес.
                  Пожалуйста, проверьте почту и перейдите по ссылке для активации аккаунта.
                </p>
                <Link to="/login" className="login-button" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                  Перейти к авторизации
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="login-page">
      <section className="login-section" style={{ backgroundImage: `url(${publicUrl}/background_1.png)` }}>
        <div className="login-background"></div>
        <div className="login-container">
          <ScrollReveal animation="fadeUp">
            <div className="login-box">
              <h1 className="login-title">Регистрация</h1>
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
                    placeholder="Введите логин"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Введите email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="first_name">Имя</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Введите имя"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Фамилия</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Введите фамилию"
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
                    placeholder="Введите пароль"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password2">Подтвердите пароль</label>
                  <input
                    type="password"
                    id="password2"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    placeholder="Подтвердите пароль"
                    required
                  />
                </div>
                <button type="submit" className="login-button" disabled={loading}>
                  {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
                <p style={{ color: '#fff', textAlign: 'center', marginTop: '15px' }}>
                  Уже есть аккаунт? <Link to="/login" style={{ color: '#4a90e2' }}>Войти</Link>
                </p>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Register;
