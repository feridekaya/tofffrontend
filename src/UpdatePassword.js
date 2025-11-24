// src/UpdatePassword.js
import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css'; // Stil için

function UpdatePassword({ authTokens }) {
  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Backend'de tanımladığımız yeni URL
  const API_URL = 'http://127.0.0.1:8000/api/user/change-password/';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Yeni şifreler frontend'de eşleşiyor mu? (Zorunlu değil ama iyi)
    if (passwords.new_password !== passwords.new_password_confirm) {
      setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
      setLoading(false);
      return;
    }

    try {
      await axios.put(API_URL, passwords, {
        headers: {
          'Authorization': `Bearer ${authTokens.access}`
        }
      });
      setMessage({ type: 'success', text: 'Şifreniz başarıyla güncellendi!' });
      // Formu temizle
      setPasswords({ old_password: '', new_password: '', new_password_confirm: '' });
    } catch (error) {
      console.error('Şifre güncelleme hatası:', error.response.data);
      if (error.response && error.response.data) {
        // Eğer varsa, bu "Eski şifre yanlış" gibi bir API hatasıdır
        const errorMsg = error.response.data?.old_password 
          ? "Eski şifreniz yanlış." 
          : (error.response.data?.new_password ? "Yeni şifre kurallara uymuyor." : "Bilinmeyen bir API hatası.");
        setMessage({ type: 'error', text: errorMsg });
      } else {
        // Eğer yoksa, bu "Sunucu kapalı" gibi bir ağ hatasıdır
        setMessage({ type: 'error', text: 'Sunucuya bağlanılamadı veya bir ağ hatası oluştu.' });
      }
    }
  };

  return (
    // CSS ile boşluk bırakmak için yeni bir sınıf
    <div className="password-update-section">
      <h2>Şifremi Güncelle</h2>
      <div className="auth-form-container" style={{ margin: 0, padding: 0, maxWidth: 'none' }}>
        <form className="auth-form" onSubmit={handleSubmit} style={{ padding: '30px' }}>
          
          {message && (
            <div className={`form-message ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
              {message.text}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="old_password">Mevcut Şifre</label>
            <input
              type="password"
              id="old_password"
              name="old_password"
              value={passwords.old_password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new_password">Yeni Şifre</label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              value={passwords.new_password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new_password_confirm">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              id="new_password_confirm"
              name="new_password_confirm"
              value={passwords.new_password_confirm}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Güncelleniyor...' : 'Şifremi Güncelle'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePassword;