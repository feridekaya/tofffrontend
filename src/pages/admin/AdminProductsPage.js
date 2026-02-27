// frontend/src/pages/admin/AdminProductsPage.js
import React, { useState, useEffect, useRef } from 'react';
import productService from '../../services/productService';
import axiosInstance from '../../services/axiosInstance';
import './AdminOrdersPage.css';
import './AdminProductsPage.css';

const EMPTY_FORM = {
    name: '', slug: '', description: '', price: '', discount_price: '',
    stock: '10', material: '', dimensions: '', weight: '',
    category: '', is_active: true,
};

function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null); // null → yeni ürün
    const [form, setForm] = useState(EMPTY_FORM);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const fileInputRef = useRef(null);

    // ── Toast ────────────────────────────────────────────────────────────────────
    const showToast = (msg, error = false) => {
        setToast({ msg, error });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Fetch ─────────────────────────────────────────────────────────────────────
    const fetchAll = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                productService.getProducts({ page_size: 100 }),
                productService.getCategories(),
            ]);
            setProducts(prodRes.data.results || prodRes.data);
            setCategories(catRes.data);
        } catch (err) {
            console.error('Veriler çekilemedi:', err);
            showToast('Veriler yüklenemedi.', true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    // ── Modal Aç ─────────────────────────────────────────────────────────────────
    const openCreate = () => {
        setEditProduct(null);
        setForm(EMPTY_FORM);
        setImageFile(null);
        setImagePreview(null);
        setModalOpen(true);
    };

    const openEdit = (product) => {
        setEditProduct(product);
        setForm({
            name: product.name || '',
            slug: product.slug || '',
            description: product.description || '',
            price: product.price || '',
            discount_price: product.discount_price || '',
            stock: product.stock ?? 10,
            material: product.material || '',
            dimensions: product.dimensions || '',
            weight: product.weight || '',
            category: product.category || '',
            is_active: product.is_active ?? true,
        });
        setImageFile(null);
        setImagePreview(product.image || null);
        setModalOpen(true);
    };

    const closeModal = () => { setModalOpen(false); setEditProduct(null); };

    // ── Form ─────────────────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const fd = new FormData();
            Object.entries(form).forEach(([key, val]) => {
                if (val !== '' && val !== null && val !== undefined) {
                    fd.append(key, val);
                }
            });
            if (imageFile) fd.append('image', imageFile);

            if (editProduct) {
                await axiosInstance.patch(`/products/${editProduct.id}/`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                showToast('Ürün güncellendi ✓');
            } else {
                await axiosInstance.post('/products/', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                showToast('Ürün eklendi ✓');
            }

            closeModal();
            fetchAll();
        } catch (err) {
            const detail = err.response?.data
                ? Object.values(err.response.data).flat().join(' ')
                : 'Bir hata oluştu.';
            showToast(detail, true);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Toggle Active ─────────────────────────────────────────────────────────────
    const handleToggleActive = async (product) => {
        try {
            await axiosInstance.patch(`/products/${product.id}/`, {
                is_active: !product.is_active,
            });
            showToast(`${product.name} ${!product.is_active ? 'aktif edildi' : 'pasif edildi'}`);
            fetchAll();
        } catch {
            showToast('Güncelleme başarısız.', true);
        }
    };

    // ── Delete ────────────────────────────────────────────────────────────────────
    const handleDelete = async (product) => {
        if (!window.confirm(`"${product.name}" ürününü silmek istediğinizden emin misiniz?`)) return;
        try {
            await axiosInstance.delete(`/products/${product.id}/`);
            showToast(`${product.name} silindi.`);
            fetchAll();
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

            {/* Toast */}
            {toast && (
                <div className={`admin-toast ${toast.error ? 'toast-error' : 'toast-success'}`}>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="admin-header-row">
                <h1 className="admin-title">Ürün Yönetimi</h1>
                <input
                    className="admin-search"
                    type="text"
                    placeholder="Ürün ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn-add-product" onClick={openCreate}>
                    + Yeni Ürün Ekle
                </button>
            </div>

            {/* Tablo */}
            <div className="orders-table-wrapper">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Görsel</th>
                            <th>Ürün Adı</th>
                            <th>Fiyat</th>
                            <th>İndirimli</th>
                            <th>Stok</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(product => (
                            <tr key={product.id}>
                                <td>
                                    {product.image
                                        ? <img src={product.image} alt={product.name} className="product-thumb" />
                                        : <div className="product-thumb-empty">—</div>
                                    }
                                </td>
                                <td>
                                    <div style={{ fontWeight: 600, color: '#EDEDED' }}>{product.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{product.category_name}</div>
                                </td>
                                <td style={{ color: '#EDEDED' }}>{parseFloat(product.price).toLocaleString('tr-TR')} ₺</td>
                                <td style={{ color: '#C08B5C' }}>
                                    {product.discount_price
                                        ? `${parseFloat(product.discount_price).toLocaleString('tr-TR')} ₺`
                                        : '—'}
                                </td>
                                <td style={{ color: product.stock < 5 ? '#f87171' : '#EDEDED' }}>
                                    {product.stock}
                                </td>
                                <td>
                                    <span className={`status-badge ${product.is_active ? 'badge-active' : 'badge-inactive'}`}>
                                        {product.is_active ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <button className="btn-details" onClick={() => openEdit(product)}>Düzenle</button>
                                        <button className="btn-details" onClick={() => handleToggleActive(product)}>
                                            {product.is_active ? 'Pasif Et' : 'Aktif Et'}
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(product)}>Sil</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#9CA3AF' }}>
                                    Ürün bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Modal ─────────────────────────────────────────────────── */}
            {modalOpen && (
                <div className="product-modal-overlay" onClick={closeModal}>
                    <div className="product-modal" onClick={e => e.stopPropagation()}>

                        <div className="product-modal-header">
                            <h2>{editProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
                            <button className="modal-close-btn" onClick={closeModal}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="product-modal-form">

                            {/* Görsel Yükleme */}
                            <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
                                {imagePreview
                                    ? <img src={imagePreview} alt="Önizleme" className="image-preview" />
                                    : <div className="image-upload-placeholder">
                                        <span style={{ fontSize: '2rem' }}>📷</span>
                                        <span>Görsel seçmek için tıklayın</span>
                                        <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>PNG, JPG, WEBP — maks 5MB</span>
                                    </div>
                                }
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* Form Grid */}
                            <div className="product-form-grid">
                                <div className="form-field full-width">
                                    <label>Ürün Adı *</label>
                                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Örn: Meşe Yemek Masası" />
                                </div>

                                <div className="form-field">
                                    <label>Slug</label>
                                    <input name="slug" value={form.slug} onChange={handleChange} placeholder="mese-yemek-masasi" />
                                </div>

                                <div className="form-field">
                                    <label>Kategori</label>
                                    <select name="category" value={form.category} onChange={handleChange}>
                                        <option value="">— Seçiniz —</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label>Fiyat (₺) *</label>
                                    <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required placeholder="0.00" />
                                </div>

                                <div className="form-field">
                                    <label>İndirimli Fiyat (₺)</label>
                                    <input name="discount_price" type="number" step="0.01" min="0" value={form.discount_price} onChange={handleChange} placeholder="Boş bırakın" />
                                </div>

                                <div className="form-field">
                                    <label>Stok Adedi</label>
                                    <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} />
                                </div>

                                <div className="form-field">
                                    <label>Malzeme</label>
                                    <input name="material" value={form.material} onChange={handleChange} placeholder="Meşe, Çelik…" />
                                </div>

                                <div className="form-field">
                                    <label>Boyutlar</label>
                                    <input name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="120x60x75 cm" />
                                </div>

                                <div className="form-field">
                                    <label>Ağırlık (kg)</label>
                                    <input name="weight" type="number" step="0.01" min="0" value={form.weight} onChange={handleChange} placeholder="0.0" />
                                </div>

                                <div className="form-field full-width">
                                    <label>Açıklama</label>
                                    <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Ürün detayları…" />
                                </div>

                                <div className="form-field checkbox-field">
                                    <label>
                                        <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
                                        Aktif (sitede görünsün)
                                    </label>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={closeModal}>İptal</button>
                                <button type="submit" className="btn-save" disabled={submitting}>
                                    {submitting ? 'Kaydediliyor…' : editProduct ? 'Güncelle' : 'Ürünü Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProductsPage;
