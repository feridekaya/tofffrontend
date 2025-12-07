//frontend/src/MyAddresses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from './config/api';

function MyAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    billing_type: 'individual',
    first_name: '',
    last_name: '',
    phone_number: '',
    tc_id: '',
    address_text: '',
    city: '',
    district: '',
    neighborhood: '',
    corporate_name: '',
    tax_office: '',
    tax_number: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const storedTokens = localStorage.getItem('authTokens');
      const tokens = storedTokens ? JSON.parse(storedTokens) : null;
      const response = await axios.get(`${API_BASE_URL}/api/addresses/`, {
        headers: { Authorization: `Bearer ${tokens?.access}` }
      });
      setAddresses(response.data);
    } catch (error) {
      console.error('Adresler yüklenemedi:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // TC Kimlik No validation - only allow numbers and max 11 digits
    if (name === 'tc_id') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-digits
      if (numericValue.length <= 11) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate TC Kimlik No if it's filled
    if (formData.billing_type === 'individual' && formData.tc_id && formData.tc_id.length !== 11) {
      alert('TC Kimlik Numarası 11 haneli olmalıdır.');
      return;
    }

    try {
      const storedTokens = localStorage.getItem('authTokens');
      const tokens = storedTokens ? JSON.parse(storedTokens) : null;

      console.log('DEBUG - storedTokens:', storedTokens);
      console.log('DEBUG - tokens?.access:', tokens?.access);

      if (!tokens?.access) {
        alert('Oturum açmanız gerekmektedir. Lütfen giriş yapın.');
        return;
      }

      // Clean up data: convert empty strings to null for optional fields
      const cleanedData = {
        ...formData,
        tc_id: formData.tc_id || null,
        corporate_name: formData.corporate_name || null,
        tax_office: formData.tax_office || null,
        tax_number: formData.tax_number || null,
      };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/addresses/${editingId}/`, cleanedData, {
          headers: { Authorization: `Bearer ${tokens?.access}` }
        });
        alert('Adres başarıyla güncellendi!');
      } else {
        await axios.post(`${API_BASE_URL}/api/addresses/`, cleanedData, {
          headers: { Authorization: `Bearer ${tokens?.access}` }
        });
        alert('Adres başarıyla kaydedildi!');
      }

      await fetchAddresses(); // Wait for addresses to reload
      resetForm();
    } catch (error) {
      console.error('Adres kaydedilemedi:', error);
      console.error('Hata detayı:', error.response?.data);

      // DRF validation errors are field-based objects like {field: ["error"]}
      const errorData = error.response?.data;
      let errorMessage = 'Adres kaydedilirken bir hata oluştu: ';

      if (errorData && typeof errorData === 'object') {
        // Convert field errors to readable message
        const fieldErrors = Object.entries(errorData)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ');
        errorMessage += fieldErrors || error.message;
      } else {
        errorMessage += error.message;
      }

      alert(errorMessage);
    }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu adresi silmek istediğinizden emin misiniz?')) return;

    try {
      const storedTokens = localStorage.getItem('authTokens');
      const tokens = storedTokens ? JSON.parse(storedTokens) : null;
      await axios.delete(`${API_BASE_URL}/api/addresses/${id}/`, {
        headers: { Authorization: `Bearer ${tokens?.access}` }
      });
      fetchAddresses();
    } catch (error) {
      console.error('Adres silinemedi:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      billing_type: 'individual',
      first_name: '',
      last_name: '',
      phone_number: '',
      tc_id: '',
      address_text: '',
      city: '',
      district: '',
      neighborhood: '',
      corporate_name: '',
      tax_office: '',
      tax_number: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <h2>Adreslerim</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {showForm ? 'İptal' : 'Yeni Adres Ekle'}
      </button>

      {showForm && (
        <div style={{
          border: '1px solid #ddd',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>{editingId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h3>
          <form onSubmit={handleSubmit}>

            {/* FATURA BİLGİLERİNİZ */}
            <div style={{ marginBottom: '20px' }}>
              <h4>FATURA BİLGİLERİNİZ</h4>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <strong>FATURA TİPİ *</strong>
                <div style={{ marginTop: '5px' }}>
                  <label style={{ marginRight: '20px' }}>
                    <input
                      type="radio"
                      name="billing_type"
                      value="individual"
                      checked={formData.billing_type === 'individual'}
                      onChange={handleInputChange}
                    />
                    {' '}Bireysel
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="billing_type"
                      value="corporate"
                      checked={formData.billing_type === 'corporate'}
                      onChange={handleInputChange}
                    />
                    {' '}Kurumsal
                  </label>
                </div>
              </label>
            </div>

            {/* KİŞİSEL BİLGİLERİNİZ */}
            <div style={{ marginBottom: '20px' }}>
              <h4>KİŞİSEL BİLGİLERİNİZ</h4>

              <div style={{ marginBottom: '10px' }}>
                <strong style={{ display: 'block', marginBottom: '5px' }}>ADINIZ SOYADINIZ *</strong>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    style={{ flex: 1, padding: '8px', boxSizing: 'border-box' }}
                    placeholder="Feride"
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    style={{ flex: 1, padding: '8px', boxSizing: 'border-box' }}
                    placeholder="Kaya"
                  />
                </div>
              </div>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <strong>CEP TELEFONUNUZ *</strong>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  placeholder="05XXXXXXXXX"
                />
              </label>

              {formData.billing_type === 'individual' && (
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  <strong>TC KİMLİK NUMARANIZ</strong>
                  <input
                    type="text"
                    name="tc_id"
                    value={formData.tc_id}
                    onChange={handleInputChange}
                    maxLength="11"
                    pattern="\d{11}"
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    placeholder="Lütfen T.C. kimlik numaranızı yazınız (11 haneli)"
                  />
                  {formData.tc_id && formData.tc_id.length !== 11 && (
                    <small style={{ color: 'red', display: 'block', marginTop: '5px' }}>
                      TC Kimlik Numarası 11 haneli olmalıdır
                    </small>
                  )}
                </label>
              )}

              {formData.billing_type === 'corporate' && (
                <>
                  <label style={{ display: 'block', marginBottom: '10px' }}>
                    <strong>ŞİRKET ADI *</strong>
                    <input
                      type="text"
                      name="corporate_name"
                      value={formData.corporate_name}
                      onChange={handleInputChange}
                      required={formData.billing_type === 'corporate'}
                      style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                  </label>
                  <label style={{ display: 'block', marginBottom: '10px' }}>
                    <strong>VERGİ DAİRESİ *</strong>
                    <input
                      type="text"
                      name="tax_office"
                      value={formData.tax_office}
                      onChange={handleInputChange}
                      required={formData.billing_type === 'corporate'}
                      style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                  </label>
                  <label style={{ display: 'block', marginBottom: '10px' }}>
                    <strong>VERGİ NUMARASI *</strong>
                    <input
                      type="text"
                      name="tax_number"
                      value={formData.tax_number}
                      onChange={handleInputChange}
                      required={formData.billing_type === 'corporate'}
                      style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                  </label>
                </>
              )}
            </div>

            {/* ADRES BİLGİLERİNİZ */}
            <div style={{ marginBottom: '20px' }}>
              <h4>ADRES BİLGİLERİNİZ</h4>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <strong>ADRESİNİZ *</strong>
                <textarea
                  name="address_text"
                  value={formData.address_text}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  placeholder="Lütfen adresinizi cadde, sokak, bina ve daire numarası bilgilerini içerecek şekilde yazınız."
                />
              </label>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <strong>İL SEÇİNİZ *</strong>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  placeholder="Lütfen il seçiniz"
                />
              </label>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <strong>İLÇE SEÇİNİZ *</strong>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  placeholder="Lütfen ilçe seçiniz"
                />
              </label>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <strong>MAHALLE SEÇİNİZ *</strong>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  placeholder="Lütfen mahalle seçiniz"
                />
              </label>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <strong>ADRES BAŞLIĞI *</strong>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  placeholder="Adresinize bir isim verin Ör: İş Adresim"
                />
              </label>
            </div>

            <button
              type="submit"
              style={{
                padding: '12px 30px',
                backgroundColor: '#d9534f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              {editingId ? 'Güncelle' : 'Kaydet'}
            </button>

            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '12px 30px',
                backgroundColor: '#999',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              İptal
            </button>
          </form>
        </div>
      )}

      {/* Adres Listesi */}
      <div>
        <h3>Kayıtlı Adresleriniz</h3>
        {addresses.length === 0 ? (
          <p>Henüz kayıtlı adresiniz bulunmamaktadır.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {addresses.map(address => (
              <div
                key={address.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '8px',
                  backgroundColor: '#fff'
                }}
              >
                <h4 style={{ marginTop: 0 }}>{address.title}</h4>
                <p><strong>{address.first_name} {address.last_name}</strong></p>
                <p>{address.address_text}</p>
                <p>{address.neighborhood}, {address.district}, {address.city}</p>
                <p>Telefon: {address.phone_number}</p>
                <p>Fatura Tipi: {address.billing_type === 'individual' ? 'Bireysel' : 'Kurumsal'}</p>

                <button
                  onClick={() => handleEdit(address)}
                  style={{
                    padding: '8px 15px',
                    marginRight: '10px',
                    backgroundColor: '#5bc0de',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Düzenle
                </button>

                <button
                  onClick={() => handleDelete(address.id)}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#d9534f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAddresses;
