import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from './config/api';
import './AdminOrdersPage.css'; // We'll create this CSS

function AdminOrdersPage({ authTokens }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Status mapping for badges
  const statusColors = {
    pending_payment: 'bg-yellow-500',
    order_confirmed: 'bg-blue-500',
    preparing: 'bg-indigo-500',
    metalworks: 'bg-orange-600',
    woodworks: 'bg-amber-700',
    finishing: 'bg-purple-600',
    quality_control: 'bg-teal-600',
    shipped: 'bg-green-600',
    delivered: 'bg-green-800',
    cancelled: 'bg-red-600'
  };
  
  const statusLabels = {
    pending_payment: 'Ödeme Bekleniyor',
    order_confirmed: 'Sipariş Onaylandı',
    preparing: 'Üretime Hazırlanıyor',
    metalworks: 'Metal İşçiliği',
    woodworks: 'Ahşap İşçiliği',
    finishing: 'Boya & Vernik',
    quality_control: 'Kalite Kontrol',
    shipped: 'Kargoya Verildi',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal/İade'
  };

  useEffect(() => {
    fetchOrders();
  }, [authTokens]);

  const fetchOrders = async () => {
    try {
      if (!authTokens) {
          // Redirect handled by App.js usually, but safety check
          return;
      }
      const response = await axios.get(`${API_BASE_URL}/api/orders/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Siparişler çekilemedi:", error);
      setLoading(false);
    }
  };

  const handleRowClick = (orderId) => {
      navigate(`/admin/orders/${orderId}`);
  };

  if (loading) return <div className="admin-loading">Siparişler Yükleniyor...</div>;

  return (
    <div className="admin-orders-container">
      <h1 className="admin-title">Sipariş Yönetim Paneli</h1>
      
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Müşteri</th>
              <th>Tarih</th>
              <th>Durum</th>
              <th>Tutar</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} onClick={() => handleRowClick(order.id)} className="clickable-row">
                <td className="font-mono">#TOFF-{1000 + order.id}</td>
                <td>
                    <div className="customer-info">
                        <span className="customer-name">{order.full_name}</span>
                        <span className="customer-email">{order.user_email}</span>
                    </div>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString('tr-TR')}</td>
                <td>
                  <span className={`status-badge ${statusColors[order.status] || 'bg-gray-600'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td className="font-bold">{parseFloat(order.total_amount).toLocaleString('tr-TR')} ₺</td>
                <td>
                  <button className="btn-details" onClick={(e) => { e.stopPropagation(); handleRowClick(order.id); }}>
                    Detay
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
                <tr>
                    <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Henüz sipariş bulunmamaktadır.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrdersPage;
