import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from './config/api';
import './CustomerOrderDetailPage.css';
import { FaBoxOpen, FaClipboardCheck, FaHammer, FaTruck, FaCheckCircle } from 'react-icons/fa';

function CustomerOrderDetailPage({ authTokens }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Status mapping for timeline
    // 'active' state logic: if current status index >= step index

    // Backend Statuses:
    // pending_payment, order_confirmed, preparing, metalworks, woodworks
    // finishing, quality_control, shipped, delivered, cancelled

    // Visual Stages Mapping
    const timelineStages = [
        {
            id: 1,
            label: 'Sipariş Alındı',
            icon: <FaClipboardCheck />,
            statuses: ['pending_payment', 'order_confirmed']
        },
        {
            id: 2,
            label: 'Üretim Aşamasında',
            icon: <FaHammer />,
            statuses: ['preparing', 'metalworks', 'woodworks']
        },
        {
            id: 3,
            label: 'Kalite Kontrol',
            icon: <FaCheckCircle />, // Shield icon alternative if available, using check for now or import FaShieldAlt
            statuses: ['finishing', 'quality_control']
        },
        {
            id: 4,
            label: 'Kargoya Verildi',
            icon: <FaTruck />,
            statuses: ['shipped']
        },
        {
            id: 5,
            label: 'Teslim Edildi',
            icon: <FaBoxOpen />,
            statuses: ['delivered']
        }
    ];

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!authTokens) return;
                const response = await axios.get(`${API_BASE_URL}/api/orders/${id}/`, {
                    headers: { Authorization: `Bearer ${authTokens.access}` }
                });
                setOrder(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Sipariş detayı alınamadı:", error);
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, authTokens]);

    if (loading) return <div className="loading-container">Yükleniyor...</div>;
    if (!order) return <div className="loading-container">Sipariş bulunamadı.</div>;

    // Determine current stage index based on order.status
    let currentStageIndex = -1;
    timelineStages.forEach((stage, index) => {
        if (stage.statuses.includes(order.status)) {
            currentStageIndex = index;
        }
    });

    // If status is cancelled, handle separately or show as stopped
    const isCancelled = order.status === 'cancelled';

    return (
        <div className="customer-order-detail-container">
            <button className="back-link" onClick={() => navigate('/hesabim')}>&larr; Siparişlerime Dön</button>

            <div className="order-header-section">
                <h1>Sipariş #{1000 + order.id}</h1>
                <span className="order-date-badge">{new Date(order.created_at).toLocaleDateString('tr-TR')}</span>
            </div>

            {isCancelled ? (
                <div className="cancelled-banner">Bu sipariş iptal edilmiştir.</div>
            ) : (
                <div className="timeline-wrapper">
                    <div className="timeline-line-container">
                        <div className="timeline-line-background"></div>
                        <div
                            className="timeline-line-progress"
                            style={{ width: `${(currentStageIndex / (timelineStages.length - 1)) * 100}%` }}
                        ></div>
                    </div>

                    <div className="timeline-steps-row">
                        {timelineStages.map((stage, index) => {
                            const isCompleted = index <= currentStageIndex;
                            const isCurrent = index === currentStageIndex;

                            return (
                                <div key={stage.id} className={`timeline-step-item ${isCompleted ? 'active' : ''} ${isCurrent ? 'pulsing' : ''}`}>
                                    <div className="step-icon-circle">
                                        {stage.icon}
                                    </div>
                                    <div className="step-label text-center">
                                        {stage.label}
                                        {isCurrent && stage.label === 'Kargoya Verildi' && order.tracking_number && (
                                            <div className="tracking-info">
                                                Takip No: {order.tracking_number}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="order-info-grid">
                <div className="info-box">
                    <h3>Teslimat Adresi</h3>
                    <p>{order.full_name}</p>
                    <p>{order.address}</p>
                    <p>{order.city}</p>
                    <p>{order.phone}</p>
                </div>
                <div className="info-box">
                    <h3>Ödeme Özeti</h3>
                    <div className="summary-row">
                        <span>Ara Toplam</span>
                        <span>{parseFloat(order.total_amount).toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <div className="summary-row total">
                        <span>Toplam</span>
                        <span>{parseFloat(order.total_amount).toLocaleString('tr-TR')} ₺</span>
                    </div>
                </div>
            </div>

            <div className="order-items-list">
                <h3>Sipariş İçeriği</h3>
                {order.items.map(item => (
                    <div key={item.id} className="order-item-row">
                        <div className="item-image">
                            {item.product_image ? (
                                <img src={`${API_BASE_URL}${item.product_image}`} alt={item.product_name} />
                            ) : (
                                <div className="placeholder-img">Görsel Yok</div>
                            )}
                        </div>
                        <div className="item-details">
                            <h4>{item.product_name}</h4>
                            <div className="item-variants">
                                {item.selected_size && <span>Boyut: {item.selected_size}</span>}
                                {item.selected_color && <span>Renk: {item.selected_color}</span>}
                            </div>
                            <div className="item-price">
                                {item.quantity} x {parseFloat(item.price).toLocaleString('tr-TR')} ₺
                            </div>
                        </div>
                        <div className="item-total-price">
                            {(item.quantity * parseFloat(item.price)).toLocaleString('tr-TR')} ₺
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default CustomerOrderDetailPage;
