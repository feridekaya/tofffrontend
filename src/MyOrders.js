import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from './config/api';
import './AccountPage.css'; // Re-use account styles

function MyOrders({ authTokens }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!authTokens) return;

        const response = await axios.get(`${API_BASE_URL}/api/orders/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` }
        });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Siparişler yüklenemedi:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authTokens]);

  const handleOrderClick = (orderId) => {
    navigate(`/hesabim/siparisler/${orderId}`);
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending_payment: 'Ödeme Bekleniyor',
      order_confirmed: 'Sipariş Onaylandı',
      preparing: 'Hazırlanıyor',
      metalworks: 'Üretimde (Metal)',
      woodworks: 'Üretimde (Ahşap)',
      finishing: 'Boya & Vernik',
      quality_control: 'Kalite Kontrol',
      shipped: 'Kargoya Verildi',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    };
    return labels[status] || status;
  };

  if (loading) return <div className="text-gray-400">Siparişler yükleniyor...</div>;

  return (
    <div className="my-orders-container">
      <h3>Siparişlerim</h3>
      {orders.length === 0 ? (
        <p className="no-orders">Henüz bir siparişiniz bulunmuyor.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card" onClick={() => handleOrderClick(order.id)}>
              <div className="order-header">
                <span className="order-number">#{1000 + order.id}</span>
                <span className="order-date">{new Date(order.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="order-body">
                <div className="order-status text-copper">
                  {getStatusLabel(order.status)}
                </div>
                <div className="order-total">
                  {parseFloat(order.total_amount).toLocaleString('tr-TR')} ₺
                </div>
              </div>
              <div className="order-footer">
                <span className="btn-detail">Detayları Gör &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
