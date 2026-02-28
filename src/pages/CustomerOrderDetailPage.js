import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { useAuth } from '../context/AuthContext';
import { FaBoxOpen, FaClipboardCheck, FaHammer, FaTruck, FaCheckCircle } from 'react-icons/fa';

const TIMELINE_STAGES = [
    { id: 1, label: 'Sipariş Alındı', icon: <FaClipboardCheck />, statuses: ['pending_payment', 'order_confirmed'] },
    { id: 2, label: 'Üretim Aşamasında', icon: <FaHammer />, statuses: ['preparing', 'metalworks', 'woodworks'] },
    { id: 3, label: 'Kalite Kontrol', icon: <FaCheckCircle />, statuses: ['finishing', 'quality_control'] },
    { id: 4, label: 'Kargoya Verildi', icon: <FaTruck />, statuses: ['shipped'] },
    { id: 5, label: 'Teslim Edildi', icon: <FaBoxOpen />, statuses: ['delivered'] },
];

function CustomerOrderDetailPage() {
    const { authTokens } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authTokens) return;
        axios.get(`${API_BASE_URL}/api/orders/${id}/`, {
            headers: { Authorization: `Bearer ${authTokens.access}` }
        })
            .then(res => { setOrder(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [id, authTokens]);

    if (loading) return (
        <div className="flex items-center justify-center h-48 text-toff-muted gap-3">
            <div className="w-8 h-8 border-2 border-toff-border border-t-toff-accent rounded-full animate-spin" />
            Yükleniyor...
        </div>
    );
    if (!order) return <div className="text-center py-20 text-toff-muted">Sipariş bulunamadı.</div>;

    let currentStageIndex = -1;
    TIMELINE_STAGES.forEach((stage, i) => {
        if (stage.statuses.includes(order.status)) currentStageIndex = i;
    });
    const isCancelled = order.status === 'cancelled';

    const sectionCard = 'bg-toff-bg-2 border border-toff-border rounded-xl p-5';
    const sectionTitle = 'text-xs font-bold text-toff-faint uppercase tracking-widest mb-4';

    return (
        <div className="max-w-3xl animate-fade-up">
            {/* Geri */}
            <button
                onClick={() => navigate('/hesabim')}
                className="inline-flex items-center gap-1 text-sm text-toff-muted hover:text-toff-accent transition-colors mb-6"
            >
                ← Siparişlerime Dön
            </button>

            {/* Başlık */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-toff-text">Sipariş #{1000 + order.id}</h2>
                <span className="text-xs text-toff-faint bg-toff-bg px-3 py-1 rounded-full border border-toff-border">
                    {new Date(order.created_at).toLocaleDateString('tr-TR')}
                </span>
            </div>

            {/* Timeline */}
            {isCancelled ? (
                <div className="mb-6 bg-red-900/20 border border-red-700/40 text-red-400 text-sm px-5 py-3 rounded-xl">
                    ⚠️ Bu sipariş iptal edilmiştir.
                </div>
            ) : (
                <div className={`${sectionCard} mb-6`}>
                    <p className={sectionTitle}>Sipariş Durumu</p>
                    {/* Progress Bar */}
                    <div className="relative mb-6">
                        <div className="absolute top-4 left-0 right-0 h-0.5 bg-toff-border" />
                        <div
                            className="absolute top-4 left-0 h-0.5 bg-toff-accent transition-all duration-700"
                            style={{ width: `${currentStageIndex >= 0 ? (currentStageIndex / (TIMELINE_STAGES.length - 1)) * 100 : 0}%` }}
                        />
                        {/* Steps */}
                        <div className="relative flex justify-between">
                            {TIMELINE_STAGES.map((stage, i) => {
                                const isCompleted = i <= currentStageIndex;
                                const isCurrent = i === currentStageIndex;
                                return (
                                    <div key={stage.id} className="flex flex-col items-center gap-2 flex-1">
                                        <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 transition-all z-10
                      ${isCompleted
                                                ? 'bg-toff-accent border-toff-accent text-white'
                                                : 'bg-toff-bg border-toff-border text-toff-faint'
                                            }
                      ${isCurrent ? 'ring-2 ring-toff-accent/40 ring-offset-2 ring-offset-toff-bg-2' : ''}
                    `}>
                                            {stage.icon}
                                        </div>
                                        <span className={`text-[10px] font-semibold text-center leading-tight max-w-[60px] ${isCompleted ? 'text-toff-text' : 'text-toff-faint'}`}>
                                            {stage.label}
                                        </span>
                                        {isCurrent && stage.label === 'Kargoya Verildi' && order.tracking_number && (
                                            <span className="text-[9px] text-toff-accent font-bold">
                                                {order.tracking_number}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Adres + Ödeme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className={sectionCard}>
                    <p className={sectionTitle}>Teslimat Adresi</p>
                    <div className="flex flex-col gap-1 text-sm text-toff-muted">
                        <span className="font-semibold text-toff-text">{order.full_name}</span>
                        <span>{order.address}</span>
                        <span>{order.city}</span>
                        <span>{order.phone}</span>
                    </div>
                </div>
                <div className={sectionCard}>
                    <p className={sectionTitle}>Ödeme Özeti</p>
                    <div className="flex justify-between text-sm text-toff-muted mb-2">
                        <span>Ara Toplam</span>
                        <span>{parseFloat(order.total_amount).toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-toff-text border-t border-toff-border pt-2">
                        <span>Toplam</span>
                        <span className="text-toff-accent">{parseFloat(order.total_amount).toLocaleString('tr-TR')} ₺</span>
                    </div>
                </div>
            </div>

            {/* Ürün Listesi */}
            <div className={sectionCard}>
                <p className={sectionTitle}>Sipariş İçeriği</p>
                <div className="flex flex-col gap-4">
                    {order.items.map(item => (
                        <div key={item.id} className="flex gap-4 items-start pb-4 border-b border-toff-border/50 last:border-b-0 last:pb-0">
                            <div className="w-16 h-16 bg-toff-bg-3 rounded-lg overflow-hidden shrink-0">
                                {item.product_image
                                    ? <img src={`${API_BASE_URL}${item.product_image}`} alt={item.product_name} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center text-toff-faint text-[10px]">Görsel Yok</div>
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-toff-text mb-1 truncate">{item.product_name}</h4>
                                <div className="flex flex-wrap gap-2 mb-1">
                                    {item.selected_size && <span className="text-[11px] text-toff-faint bg-toff-bg px-2 py-0.5 rounded">Boyut: {item.selected_size}</span>}
                                    {item.selected_color && <span className="text-[11px] text-toff-faint bg-toff-bg px-2 py-0.5 rounded">Renk: {item.selected_color}</span>}
                                </div>
                                <p className="text-xs text-toff-muted">{item.quantity} × {parseFloat(item.price).toLocaleString('tr-TR')} ₺</p>
                            </div>
                            <span className="text-sm font-bold text-toff-text shrink-0">
                                {(item.quantity * parseFloat(item.price)).toLocaleString('tr-TR')} ₺
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CustomerOrderDetailPage;
