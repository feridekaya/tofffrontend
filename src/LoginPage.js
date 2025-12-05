// frontend/src/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css'; // Kayıt formumuzla aynı stili kullanacak
import API_BASE_URL from './config/api';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/token/`, {
        username: email, // Backend 'username' bekliyor ama biz email gönderiyoruz (EmailBackend bunu halledecek)
        password: password,
      });

      console.log('Giriş başarılı:', response.data);
      const tokens = response.data;
      onLoginSuccess(tokens);
      navigate('/');

    } catch (err) {
      console.error('Giriş hatası:', err.response?.data);
      setError('E-posta veya şifre hatalı.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Giriş Yap</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            type="email"
            id="email"
            value={email}
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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">Giriş Yap</button>

        <div className="auth-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
          <span style={{ color: '#9CA3AF' }}>Hesabınız yok mu? </span>
          <a href="/register" style={{ color: '#C08B5C', fontWeight: 'bold', textDecoration: 'underline' }}>
            Üye Ol
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
// <-- FAZLADAN '}' PARANTEZİ SİLİNDİ
