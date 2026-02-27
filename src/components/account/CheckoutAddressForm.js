import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

function CheckoutAddressForm({ authTokens, onSuccess, onCancel }) {
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

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [loadingLocations, setLoadingLocations] = useState(false);

    useEffect(() => {
        fetchProvinces();
    }, []);

    const fetchProvinces = async () => {
        try {
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
        if (name === 'tc_id') {
            const numericValue = value.replace(/\D/g, '');
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

        if (formData.billing_type === 'individual' && formData.tc_id && formData.tc_id.length !== 11) {
            alert('TC Kimlik Numarası 11 haneli olmalıdır.');
            return;
        }

        try {
            if (!authTokens?.access) {
                alert('Oturum hatası.');
                return;
            }

            const cleanedData = {
                ...formData,
                tc_id: formData.tc_id || null,
                corporate_name: formData.corporate_name || null,
                tax_office: formData.tax_office || null,
                tax_number: formData.tax_number || null,
            };

            await axios.post(`${API_BASE_URL}/api/addresses/`, cleanedData, {
                headers: { Authorization: `Bearer ${authTokens.access}` }
            });

            alert('Adres başarıyla kaydedildi!');
            if (onSuccess) onSuccess();

        } catch (error) {
            console.error('Kayıt hatası:', error);
            alert('Adres kaydedilirken bir hata oluştu.');
        }
    };

    return (
        <div className="checkout-address-form">
            <h3>Yeni Adres Ekle</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Adres Başlığı *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Ör: Ev, İş" />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Ad *</label>
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Soyad *</label>
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Telefon *</label>
                    <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleInputChange} required placeholder="05..." maxLength="11" />
                </div>

                <div className="form-group">
                    <label>Adres *</label>
                    <textarea name="address_text" value={formData.address_text} onChange={handleInputChange} required rows="3" placeholder="Mahalle, Sokak, No..." />
                </div>

                <div className="form-group">
                    <label>İl *</label>
                    <select name="city" value={formData.city} onChange={handleCityChange} required>
                        <option value="">Seçiniz</option>
                        {provinces.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>İlçe *</label>
                    <select name="district" value={formData.district} onChange={handleDistrictChange} required disabled={!formData.city}>
                        <option value="">Seçiniz</option>
                        {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Mahalle *</label>
                    <select name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} required disabled={!formData.district}>
                        <option value="">{loadingLocations ? 'Yükleniyor...' : 'Seçiniz'}</option>
                        {neighborhoods.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
                    </select>
                </div>

                <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="submit" className="complete-order-btn" style={{ padding: '10px' }}>Kaydet</button>
                    <button type="button" onClick={onCancel} className="complete-order-btn" style={{ background: '#333', padding: '10px' }}>İptal</button>
                </div>
            </form>
        </div>
    );
}

export default CheckoutAddressForm;
