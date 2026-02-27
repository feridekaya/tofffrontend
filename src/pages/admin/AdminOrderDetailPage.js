import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import './AdminOrderDetailPage.css';

function AdminOrderDetailPage() {
  const { authTokens } = useAuth()
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [trackingInput, setTrackingInput] = useState('');

    // Status Workflow Definition
    const statusSteps = [
        { key: 'pending_payment', label: 'Ödeme Bekleniyor' },
        { key: 'order_confirmed', label: 'Sipariş Onaylandı' },
        { key: 'preparing', label: 'Üretime Hazırlanıyor' },
        { key: 'metalworks', label: 'Metal İşçiliği' },
        { key: 'woodworks', label: 'Ahşap İşçiliği' },
        { key: 'finishing', label: 'Boya & Vernik' },
        { key: 'quality_control', label: 'Kalite Kontrol' },
        { key: 'shipped', label: 'Kargoya Verildi' },
        { key: 'delivered', label: 'Teslim Edildi' },
        { key: 'cancelled', label: 'İptal/İade' }
    ];

    useEffect(() => {
        fetchOrderDetails();
    }, [id, authTokens]);

    const fetchOrderDetails = async () => {
        try {
            if (!authTokens) return;
            const response = await axios.get(`${API_BASE_URL}/api/orders/${id}/`, {
                headers: { Authorization: `Bearer ${authTokens.access}` }
            });
            setOrder(response.data);
            setTrackingInput(response.data.tracking_number || '');
            setLoading(false);
        } catch (error) {
            console.error("Sipariş detayı çekilemedi:", error);
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/api/orders/${id}/update_status/`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${authTokens.access}` } }
            );
            setOrder(response.data);
            alert(`Statü güncellendi: ${newStatus}`);
        } catch (error) {
            console.error("Statü güncellenemedi:", error);
            alert("Hata oluştu.");
        }
        setUpdating(false);
    };

    const saveTrackingNumber = async () => {
        setUpdating(true);
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/api/orders/${id}/update_status/`,
                { tracking_number: trackingInput },
                { headers: { Authorization: `Bearer ${authTokens.access}` } }
            );
            setOrder(response.data);
            alert("Takip numarası kaydedildi.");
        } catch (error) {
            console.error("Takip no kaydedilemedi:", error);
            alert("Hata oluştu.");
        }
        setUpdating(false);
    };

    if (loading) return <div className="admin-loading">Detaylar Yükleniyor...</div>;
    if (!order) return <div className="admin-loading">Sipariş bulunamadı.</div>;

    const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

    return (
        <div className="admin-detail-container">
            <button className="back-btn" onClick={() => navigate('/admin/orders')}>&larr; Listeye Dön</button>

            <div className="detail-header">
                <div>
                    <h1 className="detail-title">Sipariş #{1000 + order.id}</h1>
                    <span className="detail-date">{new Date(order.created_at).toLocaleString('tr-TR')}</span>
                </div>
                <div className="total-amount-box">
                    <span>Toplam Tutar</span>
                    <strong>{parseFloat(order.total_amount).toLocaleString('tr-TR')} ₺</strong>
                </div>
            </div>

            {/* CUSTOMER & NOTE SECTION */}
            <div className="info-grid">
                <div className="info-card customer-card">
                    <h3>Müşteri Bilgileri</h3>
                    <p><strong>Ad Soyad:</strong> {order.full_name}</p>
                    <p><strong>E-posta:</strong> {order.user_email}</p>
                    <p><strong>Telefon:</strong> {order.phone}</p>
                    <p><strong>Adres:</strong> {order.address}, {order.city}</p>
                </div>

                <div className="info-card note-card">
                    <h3>⚠️ Müşteri Notları / Özel İstekler</h3>
                    {order.customer_note ? (
                        <div className="note-content">{order.customer_note}</div>
                    ) : (
                        <div className="no-note">Müşteri notu bulunmamaktadır.</div>
                    )}
                </div>
            </div>

            {/* PROGRESS TIMELINE */}
            <div className="timeline-section">
                <h3>Üretim Süreci</h3>
                <div className="timeline-scroller">
                    <div className="timeline-steps">
                        {statusSteps.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            return (
                                <div
                                    key={step.key}
                                    className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                                    onClick={() => updateStatus(step.key)}
                                >
                                    <div className="step-dot"></div>
                                    <div className="step-label">{step.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* TRACKING NUMBER */}
            <div className="tracking-section">
                <h3>Kargo Takip</h3>
                <div className="tracking-input-group">
                    <input
                        type="text"
                        placeholder="Takip Numarası Giriniz..."
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                    />
                    <button onClick={saveTrackingNumber} disabled={updating}>Kaydet</button>
                </div>
            </div>

            {/* PRODUCT LIST */}
            <div className="product-list-section">
                <h3>Sipariş İçeriği</h3>
                <table className="detail-products-table">
                    <thead>
                        <tr>
                            <th>Görsel</th>
                            <th>Ürün</th>
                            <th>Varyasyonlar</th>
                            <th>Adet</th>
                            <th>Fiyat</th>
                            <th>Toplam</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map(item => (
                            <tr key={item.id}>
                                <td>
                                    {item.product_image ? (
                                        <img src={`${API_BASE_URL}${item.product_image}`} alt={item.product_name} className="item-thumb" />
                                    ) : (
                                        <div className="no-img">No Img</div>
                                    )}
                                </td>
                                <td>{item.product_name}</td>
                                <td>
                                    {item.selected_size && <span className="variant-tag">Boyut: {item.selected_size}</span>}
                                    {item.selected_color && <span className="variant-tag">Renk: {item.selected_color}</span>}
                                </td>
                                <td>{item.quantity}</td>
                                <td>{parseFloat(item.price).toLocaleString('tr-TR')} ₺</td>
                                <td>{(item.quantity * parseFloat(item.price)).toLocaleString('tr-TR')} ₺</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default AdminOrderDetailPage;
