// frontend/src/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css'; // Kayıt formumuzla aynı stili kullanacak

// App.js'den 'onLoginSuccess' adında bir fonksiyon alacağız
function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Django'daki /api/token/ adresine (simplejwt'den) istek at
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: username,
        password: password,
      });

      // 2. Başarılı olursa, Django bize tokenları (jetonları) verecek
      console.log('Giriş başarılı:', response.data);
      const tokens = response.data;

      // 3. App.js'e "Giriş yaptık, jetonlarımız bunlar" diye haber ver
      onLoginSuccess(tokens); 

      // 4. Kullanıcıyı ana sayfaya yönlendir
      navigate('/'); 

    } catch (err) {
      // 401 (Yetkisiz) hatası gelirse (şifre yanlışsa)
      console.error('Giriş hatası:', err.response.data);
      setError('Kullanıcı adı veya şifre hatalı.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Giriş Yap</h2>
        
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Kullanıcı Adı</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        {/* TODO: Buraya "Hesabın yok mu? Kayıt Ol" linki ekleyebiliriz */}
      </form>
    </div>
  );
}

export default LoginPage;