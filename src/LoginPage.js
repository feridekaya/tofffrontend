// frontend/src/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css';
import API_BASE_URL from './config/api';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/token/`, {
        username: email,
        password,
      });

      const tokens = response.data;
      onLoginSuccess(tokens);
      navigate('/');
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.error;
      setError(detail || 'E-posta veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>

        <div className="auth-logo">TOFF</div>
        <h2>Giriş Yap</h2>
        <p className="auth-subtitle">Hesabınıza hoş geldiniz</p>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            type="email"
            id="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Şifre</label>
          <input
            type="password"
            id="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ textAlign: 'right', marginBottom: '16px' }}>
          <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#C08B5C' }}>
            Şifremi Unuttum
          </Link>
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>

        <div className="auth-footer">
          <span>Hesabınız yok mu? </span>
          <Link to="/register" style={{ color: '#C08B5C', fontWeight: 'bold' }}>
            Üye Ol
          </Link>
        </div>

      </form>
    </div>
  );
}

export default LoginPage;
