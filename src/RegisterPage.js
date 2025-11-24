// frontend/src/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Yönlendirme için
import './AuthForm.css'; // Giriş ve Kayıt formları için ortak stil dosyası

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber
      });

      console.log('Kayıt başarılı:', response.data);
      navigate('/giris'); // Login sayfasına yönlendir

    } catch (err) {
      console.error('Kayıt hatası:', err.response?.data);
      setError('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Yeni Hesap Oluştur</h2>
        
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="firstName">Ad</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Soyad</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
          <label htmlFor="phoneNumber">Telefon Numarası</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="05xxxxxxxxx"
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