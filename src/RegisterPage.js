// frontend/src/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Yönlendirme için
import './AuthForm.css'; // Giriş ve Kayıt formları için ortak stil dosyası

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null); // Hata mesajlarını tutmak için
  const navigate = useNavigate(); // Başarılı olunca yönlendirmek için

  const handleSubmit = async (e) => {
    e.preventDefault(); // Formun sayfayı yenilemesini engelle
    setError(null); // Eski hataları temizle

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        username: username,
        password: password,
        email: email,
      });

      console.log('Kayıt başarılı:', response.data);
      navigate('/login'); 

    } catch (err) {
      console.error('Kayıt hatası:', err.response.data);
      setError('Kayıt başarısız. Bu kullanıcı adı veya e-posta zaten kullanılıyor olabilir.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Yeni Hesap Oluştur</h2>
        
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
        <button type="submit" className="auth-button">Kayıt Ol</button>
      </form>
    </div>
  );
}

export default RegisterPage;
// <-- FAZLADAN '}' PARANTEZİ SİLİNDİ