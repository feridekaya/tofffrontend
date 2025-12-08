//frontend/src/MyAddresses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from './config/api';
import './MyAddresses.css'; // Import the new CSS file

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

  // Location Data States
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    fetchAddresses();
    fetchProvinces();
  }, []);

  const fetchAddresses = async () => {
    try {
      const storedTokens = localStorage.getItem('authTokens');
      const tokens = storedTokens ? JSON.parse(storedTokens) : null;

      console.log('DEBUG - storedTokens:', storedTokens);
      console.log('DEBUG - tokens?.access:', tokens?.access);

      if (!tokens?.access) {
        // Can optionally alert here or just return
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/addresses/`, {
        headers: { Authorization: `Bearer ${tokens?.access}` }
      });
      setAddresses(response.data);
    } catch (error) {
      console.error('Adresler yüklenemedi:', error);
    }
  };

  const fetchProvinces = async () => {
    try {
      // Fetch all 81 provinces. Returns districts inside them too.
      const response = await axios.get('https://turkiyeapi.dev/api/v1/provinces?limit=81');
      if (response.data && response.data.data) {
        setProvinces(response.data.data);
      }
    } catch (error) {
      console.error('İller yüklenemedi:', error);
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

  const handleCityChange = (e) => {
    const selectedCityName = e.target.value;
    const selectedProvince = provinces.find(p => p.name === selectedCityName);

    setFormData(prev => ({
      ...prev,
      city: selectedCityName,
      district: '',
      neighborhood: ''
    }));

    setDistricts(selectedProvince ? selectedProvince.districts : []);
    setNeighborhoods([]);
  };

  const handleDistrictChange = async (e) => {
    const selectedDistrictName = e.target.value;
    setFormData(prev => ({
      ...prev,
      district: selectedDistrictName,
      neighborhood: ''
    }));

    // Find district ID to fetch neighborhoods
    const selectedDistrict = districts.find(d => d.name === selectedDistrictName);

    if (selectedDistrict) {
      setLoadingLocations(true);
      try {
        const response = await axios.get(`https://turkiyeapi.dev/api/v1/districts/${selectedDistrict.id}`);
        if (response.data && response.data.data && response.data.data.neighborhoods) {
          setNeighborhoods(response.data.data.neighborhoods);
        } else {
          setNeighborhoods([]);
        }
      } catch (error) {
        console.error('Mahalleler yüklenemedi:', error);
        setNeighborhoods([]);
      } finally {
        setLoadingLocations(false);
      }
    } else {
      setNeighborhoods([]);
    }
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

      if (!tokens?.access) {
        alert('Oturum süreniz dolmuş olabilir. Lütfen tekrar giriş yapın.');
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

      const errorData = error.response?.data;
      let errorMessage = 'Adres kaydedilirken bir hata oluştu: ';

      if (errorData && typeof errorData === 'object') {
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

  // Custom Edit Handler to populate districts
  const handleEditEnhanced = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);

    if (address.city) {
      const prov = provinces.find(p => p.name === address.city);
      if (prov) {
        setDistricts(prov.districts);
      }
    }
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
    setDistricts([]);
    setNeighborhoods([]);
  };

  return (
    <div className="my-addresses-container">
      <h2 className="my-addresses-header">Adreslerim</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className={`btn-new-address-toggle ${showForm ? 'active' : ''}`}
      >
        {showForm ? 'İptal' : '+ Yeni Adres Ekle'}
      </button>

      {showForm && (
        <div className="address-form-container">
          <h3>{editingId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h3>
          <form onSubmit={handleSubmit}>

            {/* FATURA BİLGİLERİNİZ */}
            <div className="address-form-group">
              <h4>FATURA BİLGİLERİNİZ</h4>
              <label className="address-form-label">
                FATURA TİPİ *
                <div className="radio-group" style={{ marginTop: '10px' }}>
                  <label>
                    <input
                      type="radio"
                      name="billing_type"
                      value="individual"
                      checked={formData.billing_type === 'individual'}
                      onChange={handleInputChange}
                    />
                    Bireysel
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="billing_type"
                      value="corporate"
                      checked={formData.billing_type === 'corporate'}
                      onChange={handleInputChange}
                    />
                    Kurumsal
                  </label>
                </div>
              </label>
            </div>

            {/* KİŞİSEL BİLGİLERİNİZ */}
            <div className="address-form-group">
              <h4>KİŞİSEL BİLGİLERİNİZ</h4>

              <div style={{ marginBottom: '15px' }}>
                <strong className="address-form-label">ADINIZ SOYADINIZ *</strong>
                <div className="address-form-row">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    maxLength="50"
                    className="address-form-input"
                    placeholder="Adınız"
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    maxLength="50"
                    className="address-form-input"
                    placeholder="Soyadınız"
                  />
                </div>
              </div>

              <label className="address-form-label">
                CEP TELEFONUNUZ *
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  maxLength="15"
                  className="address-form-input"
                  style={{ marginTop: '5px' }}
                  placeholder="05XXXXXXXXX"
                />
              </label>

              {formData.billing_type === 'individual' && (
                <label className="address-form-label" style={{ marginTop: '15px' }}>
                  TC KİMLİK NUMARANIZ
                  <input
                    type="text"
                    name="tc_id"
                    value={formData.tc_id}
                    onChange={handleInputChange}
                    maxLength="11"
                    pattern="\d{11}"
                    className="address-form-input"
                    style={{ marginTop: '5px' }}
                    placeholder="Lütfen T.C. kimlik numaranızı yazınız (11 haneli)"
                  />
                  {formData.tc_id && formData.tc_id.length !== 11 && (
                    <small className="error-text">
                      TC Kimlik Numarası 11 haneli olmalıdır
                    </small>
                  )}
                </label>
              )}

              {formData.billing_type === 'corporate' && (
                <>
                  <label className="address-form-label">
                    ŞİRKET ADI *
                    <input
                      type="text"
                      name="corporate_name"
                      value={formData.corporate_name}
                      onChange={handleInputChange}
                      required={formData.billing_type === 'corporate'}
                      className="address-form-input"
                      style={{ marginTop: '5px' }}
                    />
                  </label>
                  <label className="address-form-label">
                    VERGİ DAİRESİ *
                    <input
                      type="text"
                      name="tax_office"
                      value={formData.tax_office}
                      onChange={handleInputChange}
                      required={formData.billing_type === 'corporate'}
                      className="address-form-input"
                      style={{ marginTop: '5px' }}
                    />
                  </label>
                  <label className="address-form-label">
                    VERGİ NUMARASI *
                    <input
                      type="text"
                      name="tax_number"
                      value={formData.tax_number}
                      onChange={handleInputChange}
                      required={formData.billing_type === 'corporate'}
                      className="address-form-input"
                      style={{ marginTop: '5px' }}
                    />
                  </label>
                </>
              )}
            </div>

            {/* ADRES BİLGİLERİNİZ */}
            <div className="address-form-group">
              <h4>ADRES BİLGİLERİNİZ</h4>

              <label className="address-form-label">
                ADRESİNİZ * (Cadde, Sokak, Apartman vb. detaylar)
                <textarea
                  name="address_text"
                  value={formData.address_text}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="address-form-textarea"
                  style={{ marginTop: '5px' }}
                  placeholder="Lütfen tam adresinizi yazınız."
                />
              </label>

              {/* DYNAMIC DROPDOWNS START */}
              <label className="address-form-label" style={{ marginTop: '15px' }}>
                İL SEÇİNİZ *
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleCityChange}
                  required
                  className="address-form-select"
                  style={{ marginTop: '5px' }}
                >
                  <option value="">İl Seçiniz</option>
                  {provinces.map(prov => (
                    <option key={prov.id} value={prov.name}>{prov.name}</option>
                  ))}
                </select>
              </label>

              <label className="address-form-label" style={{ marginTop: '15px' }}>
                İLÇE SEÇİNİZ *
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleDistrictChange}
                  required
                  disabled={!formData.city}
                  className="address-form-select"
                  style={{ marginTop: '5px' }}
                >
                  <option value="">{formData.city ? 'İlçe Seçiniz' : 'Önce İl Seçiniz'}</option>
                  {districts.map(dist => (
                    <option key={dist.id} value={dist.name}>{dist.name}</option>
                  ))}
                </select>
              </label>

              <label className="address-form-label" style={{ marginTop: '15px' }}>
                MAHALLE SEÇİNİZ *
                <select
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.district || loadingLocations}
                  className="address-form-select"
                  style={{ marginTop: '5px' }}
                >
                  <option value="">
                    {loadingLocations ? 'Yükleniyor...' : (formData.district ? 'Mahalle Seçiniz' : 'Önce İlçe Seçiniz')}
                  </option>
                  {neighborhoods.map(neigh => (
                    <option key={neigh.id} value={neigh.name}>{neigh.name}</option>
                  ))}
                </select>
              </label>
              {/* DYNAMIC DROPDOWNS END */}

              <label className="address-form-label" style={{ marginTop: '15px' }}>
                ADRES BAŞLIĞI * (En fazla 50 karakter)
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  maxLength="50"
                  className="address-form-input"
                  style={{ marginTop: '5px' }}
                  placeholder="Adresinize bir isim verin Ör: İş Adresim"
                />
              </label>
            </div>

            <div style={{ marginTop: '30px' }}>
              <button
                type="submit"
                className="btn-primary-save"
              >
                {editingId ? 'Güncelle' : 'Kaydet'}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary-cancel"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Adres Listesi */}
      <div>
        <h3 className="my-addresses-header">Kayıtlı Adresleriniz</h3>
        {addresses.length === 0 ? (
          <p style={{ color: '#9CA3AF' }}>Henüz kayıtlı adresiniz bulunmamaktadır.</p>
        ) : (
          <div className="address-grid">
            {addresses.map(address => (
              <div
                key={address.id}
                className="address-card"
              >
                <h4>{address.title}</h4>
                <div className="address-text">
                  <strong>{address.first_name} {address.last_name}</strong>
                </div>
                <div className="address-text">
                  {address.address_text}
                </div>
                <div className="address-text">
                  {address.neighborhood}, {address.district}, {address.city}
                </div>
                <div className="address-meta">
                  Telefon: {address.phone_number}<br />
                  Fatura Tipi: {address.billing_type === 'individual' ? 'Bireysel' : 'Kurumsal'}
                </div>

                <div style={{ marginTop: '15px' }}>
                  <button
                    onClick={() => handleEditEnhanced(address)}
                    className="btn-edit-address"
                  >
                    Düzenle
                  </button>

                  <button
                    onClick={() => handleDelete(address.id)}
                    className="btn-delete-address"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div >
  );
}

export default MyAddresses;
