// frontend/src/AdminProductsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import './AdminOrdersPage.css';

function AdminProductsPage() {
  const { authTokens } = useAuth()
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [toastMsg, setToastMsg] = useState(null);

    const authHeaders = { Authorization: `Bearer ${authTokens?.access}` };

    const showToast = (msg, error = false) => {
        setToastMsg({ msg, error });
        setTimeout(() => setToastMsg(null), 3000);
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/products/?is_active=all`, { headers: authHeaders });
            setProducts(res.data.results || res.data);
        } catch (err) {
            console.error('Ürünler çekilemedi:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, [authTokens]);

    const handleToggleActive = async (product) => {
        try {
            await axios.patch(
                `${API_BASE_URL}/api/products/${product.id}/`,
                { is_active: !product.is_active },
                { headers: authHeaders }
            );
            showToast(`${product.name} ${!product.is_active ? 'aktif edildi' : 'pasif edildi'}`);
            fetchProducts();
        } catch {
            showToast('Güncelleme başarısız.', true);
        }
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`"${product.name}" ürününü silmek istediğinizden emin misiniz?`)) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/products/${product.id}/`, { headers: authHeaders });
            showToast(`${product.name} silindi.`);
            fetchProducts();
        } catch {
            showToast('Silme başarısız.', true);
        }
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="admin-loading">Ürünler Yükleniyor...</div>;

    return (
        <div className="admin-orders-container" style={{ position: 'relative' }}>

            {toastMsg && (
                <div className={`admin-toast ${toastMsg.error ? 'toast-error' : 'toast-success'}`}>
                    {toastMsg.msg}
                </div>
            )}

            <div className="admin-header-row">
                <h1 className="admin-title">Ürün Yönetimi</h1>
                <input
                    className="admin-search"
                    type="text"
                    placeholder="Ürün ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="orders-table-wrapper">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Görsel</th>
                            <th>Ürün Adı</th>
                            <th>Fiyat</th>
                            <th>İndirimli</th>
                            <th>Stok / Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(product => (
                            <tr key={product.id}>
                                <td>
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    )}
                                </td>
                                <td>
                                    <div style={{ fontWeight: 600, color: '#EDEDED' }}>{product.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{product.category_name}</div>
                                </td>
                                <td style={{ color: '#EDEDED' }}>{parseFloat(product.price).toLocaleString('tr-TR')} ₺</td>
                                <td style={{ color: '#C08B5C' }}>
                                    {product.discount_price ? `${parseFloat(product.discount_price).toLocaleString('tr-TR')} ₺` : '—'}
                                </td>
                                <td>
                                    <span className={`status-badge ${product.is_active ? 'badge-active' : 'badge-inactive'}`}>
                                        {product.is_active ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            className="btn-details"
                                            onClick={() => handleToggleActive(product)}
                                        >
                                            {product.is_active ? 'Pasif Et' : 'Aktif Et'}
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(product)}
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#9CA3AF' }}>
                                    Ürün bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminProductsPage;
