//frontend/src/MyUserInfo.js
// src/MyUserInfo.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AuthForm.css'; // Stil için
import API_BASE_URL from './config/api';

function MyUserInfo({ authTokens }) {

  // 1. State'i yeni nested (iç içe) yapıya göre güncelledik
  const [userData, setUserData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    profile: {
      phone_number: '',
      birth_date: '',
      gender: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // API URL'si (değişmedi)
  const API_URL = `${API_BASE_URL}/api/user/`;

  // 2. Sayfa yüklendiğinde veriyi çek
  useEffect(() => {
    const fetchUserData = async () => {
      if (!authTokens) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(API_URL, {
          headers: { 'Authorization': `Bearer ${authTokens.access}` }
        });

        // Backend'den null gelen değerleri boş string yap (formda hata olmasın)
        const data = response.data;
        data.profile = data.profile || {}; // Profil null ise boş obje yap
        data.profile.phone_number = data.profile.phone_number || '';
        data.profile.birth_date = data.profile.birth_date || '';
        data.profile.gender = data.profile.gender || '';

        setUserData(data); // Gelen veriyi state'e kaydet
        setLoading(false);
      } catch (error) {
        console.error('Kullanıcı bilgileri çekilirken hata:', error);
        // GÜVENLİK KONTROLÜ:
        if (error.response && error.response.data) {
          // API'den gelen spesifik bir hata varsa (örn: Eposta formatı yanlış)
          const errorMsg = error.response.data?.email
            ? `E-posta hatası: ${error.response.data.email[0]}`
            : 'API hatası oluştu.';
          setMessage({ type: 'error', text: errorMsg });
        } else {
          // Ağ hatası
          setMessage({ type: 'error', text: 'Sunucuya bağlanılamadı veya bir ağ hatası oluştu.' });
        }
      }
    };
    fetchUserData();
  }, [authTokens]);

  // 3. Nested state'i güncelleyen yeni input fonksiyonu
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Alanın 'profile' içinde mi yoksa ana objede mi olduğuna bak
    if (name === 'phone_number' || name === 'birth_date' || name === 'gender') {
      setUserData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [name]: value
        }
      }));
    } else {
      // Bu (email, first_name, last_name) için
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 4. Formu gönder (Güncelle)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      // Backend'e tam olarak serializer'ın beklediği yapıda gönder
      const dataToUpdate = {
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        profile: {
          phone_number: userData.profile.phone_number,
          birth_date: userData.profile.birth_date === '' ? null : userData.profile.birth_date, // Boşsa null gönder
          gender: userData.profile.gender
        }
      };

      const response = await axios.patch(API_URL, dataToUpdate, {
        headers: { 'Authorization': `Bearer ${authTokens.access}` }
      });

      // Dönen veriyi de null kontrolü yaparak state'e kaydet
      const data = response.data;
      data.profile = data.profile || {};
      data.profile.phone_number = data.profile.phone_number || '';
      data.profile.birth_date = data.profile.birth_date || '';
      data.profile.gender = data.profile.gender || '';

      setUserData(data);
      setMessage({ type: 'success', text: 'Bilgileriniz başarıyla güncellendi!' });

    } catch (error) {
      console.error('Kullanıcı bilgileri güncellenirken hata:', error);
      setMessage({ type: 'error', text: 'Güncelleme sırasında bir hata oluştu.' });
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  // 5. Görünüm (JSX) - Tamamen yenilendi
  return (
    <div>
      <h2>Kullanıcı Bilgilerim</h2>

      <div className="auth-form-container" style={{ margin: 0, padding: 0, maxWidth: 'none' }}>
        <form className="auth-form" onSubmit={handleSubmit} style={{ padding: '30px' }}>

          {message && (
            <div className={`form-message ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
              {message.text}
            </div>
          )}

          {/* "username" saçmalığı kaldırıldı. */}

          <div className="form-group">
            <label htmlFor="first_name">Ad</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={userData.first_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Soyad</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={userData.last_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange} // Artık değiştirilebilir
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Telefon Numarası</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={userData.profile.phone_number}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="birth_date">Doğum Tarihi</label>
            <input
              type="date" // Tarayıcının tarih seçicisini kullanır
              id="birth_date"
              name="birth_date"
              value={userData.profile.birth_date}
              onChange={handleInputChange}
            />
          </div>

          {/* Cinsiyet için select kutusu */}
          <div className="form-group">
            <label htmlFor="gender">Cinsiyet</label>
            <select
              id="gender"
              name="gender"
              value={userData.profile.gender}
              onChange={handleInputChange}
            >
              <option value="">Seçiniz...</option>
              <option value="female">Kadın</option>
              <option value="male">Erkek</option>
              <option value="other">Diğer</option>
            </select>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Güncelleniyor...' : 'Bilgilerimi Güncelle'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MyUserInfo;
