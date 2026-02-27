// frontend/src/AdminOrdersPage.js - Geliştirilmiş versiyon
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import AdminProductsPage from './AdminProductsPage';
import AdminCouponsPage from './AdminCouponsPage';
import './AdminOrdersPage.css';

const STATUS_COLORS = {
  pending_payment: '#CA8A04',
  order_confirmed: '#2563EB',
  preparing: '#7C3AED',
  metalworks: '#EA580C',
  woodworks: '#92400E',
  finishing: '#9333EA',
  quality_control: '#0D9488',
  shipped: '#16A34A',
  delivered: '#166534',
  cancelled: '#DC2626',
};

const STATUS_LABELS = {
  pending_payment: 'Ödeme Bekleniyor',
  order_confirmed: 'Sipariş Onaylandı',
  preparing: 'Üretime Hazırlanıyor',
  metalworks: 'Metal İşçiliği',
  woodworks: 'Ahşap İşçiliği',
  finishing: 'Boya & Vernik',
  quality_control: 'Kalite Kontrol',
  shipped: 'Kargoya Verildi',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal/İade',
};

function AdminOrdersPage() {
  const { authTokens } = useAuth()
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!authTokens) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Siparişler çekilemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [authTokens]);

  const filteredOrders = orders.filter(order => {
    const matchSearch = (
      order.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.user_email?.toLowerCase().includes(search.toLowerCase()) ||
      String(order.id).includes(search)
    );
    const matchStatus = statusFilter ? order.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const TABS = [
    { key: 'orders', label: 'Siparişler' },
    { key: 'products', label: 'Ürünler' },
    { key: 'coupons', label: 'Kuponlar' },
  ];

  return (
    <div className="admin-panel-wrapper">

      {/* Header */}
      <div className="admin-panel-header">
        <h1 className="admin-panel-title">⚙ Yönetim Paneli</h1>
      </div>

      {/* Tab Bar */}
      <div className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`admin-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.key === 'orders' && orders.length > 0 && (
              <span className="tab-badge">{orders.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'orders' && (
        <div className="admin-orders-container">
          {/* Filtre Satırı */}
          <div className="admin-header-row">
            <input
              className="admin-search"
              type="text"
              placeholder="Sipariş ara (ad, e-posta, ID)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="admin-search"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ maxWidth: '200px' }}
            >
              <option value="">Tüm Durumlar</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="admin-loading">Siparişler Yükleniyor...</div>
          ) : (
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Sipariş No</th>
                    <th>Müşteri</th>
                    <th>Tarih</th>
                    <th>Durum</th>
                    <th>Tutar</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr
                      key={order.id}
                      className="clickable-row"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      <td className="font-mono">#TOFF-{1000 + order.id}</td>
                      <td>
                        <div className="customer-info">
                          <span className="customer-name">{order.full_name}</span>
                          <span className="customer-email">{order.user_email}</span>
                        </div>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString('tr-TR')}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: STATUS_COLORS[order.status] || '#525252' }}
                        >
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td className="font-bold">
                        {parseFloat(order.total_amount).toLocaleString('tr-TR')} ₺
                      </td>
                      <td>
                        <button
                          className="btn-details"
                          onClick={(e) => { e.stopPropagation(); navigate(`/admin/orders/${order.id}`); }}
                        >
                          Detay
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#9CA3AF' }}>
                        Sipariş bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && <AdminProductsPage authTokens={authTokens} />}
      {activeTab === 'coupons' && <AdminCouponsPage authTokens={authTokens} />}
    </div>
  );
}

export default AdminOrdersPage;
