// frontend/src/AdminCouponsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from './config/api';
import './AdminOrdersPage.css';

const EMPTY_FORM = {
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_amount: '',
    max_uses: '',
    is_active: true,
};

function AdminCouponsPage({ authTokens }) {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(EMPTY_FORM);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);

    const authHeaders = { Authorization: `Bearer ${authTokens?.access}` };

    const showToast = (msg, error = false) => {
        setToastMsg({ msg, error });
        setTimeout(() => setToastMsg(null), 3000);
    };

    const fetchCoupons = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/coupons/`, { headers: authHeaders });
            setCoupons(res.data.results || res.data);
        } catch (err) {
            console.error('Kuponlar çekilemedi:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCoupons(); }, [authTokens]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.post(`${API_BASE_URL}/api/coupons/`, form, { headers: authHeaders });
            showToast('Kupon oluşturuldu!');
            setForm(EMPTY_FORM);
            setShowForm(false);
            fetchCoupons();
        } catch (err) {
            const detail = err.response?.data?.detail || JSON.stringify(err.response?.data);
            showToast(detail || 'Hata oluştu.', true);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (coupon) => {
        if (!window.confirm(`"${coupon.code}" kuponunu silmek istediğinizden emin misiniz?`)) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/coupons/${coupon.id}/`, { headers: authHeaders });
            showToast(`${coupon.code} silindi.`);
            fetchCoupons();
        } catch {
            showToast('Silme başarısız.', true);
        }
    };

    if (loading) return <div className="admin-loading">Kuponlar Yükleniyor...</div>;

    return (
        <div className="admin-orders-container" style={{ position: 'relative' }}>

            {toastMsg && (
                <div className={`admin-toast ${toastMsg.error ? 'toast-error' : 'toast-success'}`}>
                    {toastMsg.msg}
                </div>
            )}

            <div className="admin-header-row">
                <h1 className="admin-title">Kupon Yönetimi</h1>
                <button className="btn-details" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'İptal' : '+ Yeni Kupon'}
                </button>
            </div>

            {/* Kupon Oluşturma Formu */}
            {showForm && (
                <form className="admin-form" onSubmit={handleCreate}>
                    <div className="admin-form-grid">
                        <div className="form-group">
                            <label>Kupon Kodu</label>
                            <input
                                type="text"
                                placeholder="TOFF10"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>İndirim Tipi</label>
                            <select
                                value={form.discount_type}
                                onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                            >
                                <option value="percentage">Yüzde (%)</option>
                                <option value="fixed">Sabit Tutar (₺)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>İndirim Değeri</label>
                            <input
                                type="number"
                                placeholder={form.discount_type === 'percentage' ? '10' : '50'}
                                value={form.discount_value}
                                onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Min. Sipariş Tutarı (₺)</label>
                            <input
                                type="number"
                                placeholder="500"
                                value={form.min_order_amount}
                                onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Max. Kullanım</label>
                            <input
                                type="number"
                                placeholder="100"
                                value={form.max_uses}
                                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-details" disabled={saving}>
                        {saving ? 'Oluşturuluyor...' : 'Kuponu Oluştur'}
                    </button>
                </form>
            )}

            {/* Kupon Tablosu */}
            <div className="orders-table-wrapper">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Kod</th>
                            <th>Tip</th>
                            <th>Değer</th>
                            <th>Min. Tutar</th>
                            <th>Kullanım</th>
                            <th>Durum</th>
                            <th>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(coupon => (
                            <tr key={coupon.id}>
                                <td style={{ fontWeight: 700, color: '#C08B5C', letterSpacing: '1px' }}>{coupon.code}</td>
                                <td style={{ color: '#9CA3AF' }}>
                                    {coupon.discount_type === 'percentage' ? 'Yüzde' : 'Sabit'}
                                </td>
                                <td style={{ color: '#EDEDED' }}>
                                    {coupon.discount_type === 'percentage'
                                        ? `%${coupon.discount_value}`
                                        : `${coupon.discount_value} ₺`}
                                </td>
                                <td>{coupon.min_order_amount ? `${coupon.min_order_amount} ₺` : '—'}</td>
                                <td>{coupon.used_count || 0} / {coupon.max_uses || '∞'}</td>
                                <td>
                                    <span className={`status-badge ${coupon.is_active ? 'badge-active' : 'badge-inactive'}`}>
                                        {coupon.is_active ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-delete" onClick={() => handleDelete(coupon)}>Sil</button>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#9CA3AF' }}>
                                    Henüz kupon bulunmamaktadır.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminCouponsPage;
