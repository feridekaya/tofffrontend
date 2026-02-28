// frontend/src/pages/admin/AdminOrdersPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import AdminProductsPage from './AdminProductsPage';
import AdminCouponsPage from './AdminCouponsPage';
import AdminDashboardPage from './AdminDashboardPage';

const STATUS_COLORS = {
  pending_payment: 'bg-yellow-900/40 text-yellow-400 border-yellow-700/50',
  order_confirmed: 'bg-blue-900/40 text-blue-400 border-blue-700/50',
  preparing: 'bg-purple-900/40 text-purple-400 border-purple-700/50',
  metalworks: 'bg-orange-900/40 text-orange-400 border-orange-700/50',
  woodworks: 'bg-amber-900/40 text-amber-400 border-amber-700/50',
  finishing: 'bg-violet-900/40 text-violet-400 border-violet-700/50',
  quality_control: 'bg-teal-900/40 text-teal-400 border-teal-700/50',
  shipped: 'bg-green-900/40 text-green-400 border-green-700/50',
  delivered: 'bg-emerald-900/40 text-emerald-500 border-emerald-700/50',
  cancelled: 'bg-red-900/40 text-red-400 border-red-700/50',
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

const TABS = [
  { key: 'dashboard', label: '📊 Dashboard' },
  { key: 'orders', label: '📦 Siparişler' },
  { key: 'products', label: '🏷️ Ürünler' },
  { key: 'coupons', label: '🎫 Kuponlar' },
];

function AdminOrdersPage() {
  const { authTokens } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-toff-bg text-toff-muted font-sans">

      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <header className="bg-toff-bg-2 border-b border-toff-border px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg text-toff-muted hover:text-toff-text hover:bg-toff-bg-3 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-lg font-black tracking-[0.2em] text-toff-accent">TOFF</span>
          <span className="hidden sm:block text-toff-faint text-sm">⎯</span>
          <span className="hidden sm:block text-sm font-medium text-toff-text">Yönetim Paneli</span>
        </div>
        <div className="text-xs text-toff-faint">Admin</div>
      </header>

      <div className="flex">

        {/* ── Sidebar ──────────────────────────────────────────────── */}
        {/* Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`
          fixed sm:sticky top-0 sm:top-[61px] h-screen z-20 sm:z-auto
          w-56 bg-toff-bg-2 border-r border-toff-border
          flex flex-col gap-1 py-6 px-3
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
        `}>
          <p className="text-[10px] font-bold text-toff-faint uppercase tracking-widest px-3 mb-2">Menü</p>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${activeTab === tab.key
                  ? 'bg-toff-accent/15 text-toff-accent border border-toff-accent/30'
                  : 'text-toff-muted hover:bg-toff-bg-3 hover:text-toff-text'
                }`}
            >
              <span>{tab.label}</span>
              {tab.key === 'orders' && orders.length > 0 && (
                <span className="bg-toff-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* ── Main Content ──────────────────────────────────────────── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen">

          {/* Dashboard */}
          {activeTab === 'dashboard' && <AdminDashboardPage authTokens={authTokens} />}

          {/* Siparişler */}
          {activeTab === 'orders' && (
            <div className="animate-fade-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h2 className="text-xl font-bold text-toff-text">Siparişler</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Ad, e-posta veya ID ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-toff-bg border border-toff-border-2 text-toff-text rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-toff-accent w-full sm:w-56 transition-colors"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-toff-bg border border-toff-border-2 text-toff-text rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-toff-accent w-full sm:w-48 transition-colors"
                  >
                    <option value="">Tüm Durumlar</option>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-48 text-toff-muted">
                  <div className="w-8 h-8 border-2 border-toff-border border-t-toff-accent rounded-full animate-spin mr-3" />
                  Yükleniyor...
                </div>
              ) : (
                <div className="bg-toff-bg-2 border border-toff-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-toff-border bg-toff-bg/50">
                          <th className="text-left px-4 py-3 text-[11px] font-bold text-toff-faint uppercase tracking-wider">Sipariş No</th>
                          <th className="text-left px-4 py-3 text-[11px] font-bold text-toff-faint uppercase tracking-wider">Müşteri</th>
                          <th className="text-left px-4 py-3 text-[11px] font-bold text-toff-faint uppercase tracking-wider hidden md:table-cell">Tarih</th>
                          <th className="text-left px-4 py-3 text-[11px] font-bold text-toff-faint uppercase tracking-wider">Durum</th>
                          <th className="text-left px-4 py-3 text-[11px] font-bold text-toff-faint uppercase tracking-wider hidden sm:table-cell">Tutar</th>
                          <th className="text-left px-4 py-3 text-[11px] font-bold text-toff-faint uppercase tracking-wider"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order, i) => (
                          <tr
                            key={order.id}
                            className={`border-b border-toff-border/50 hover:bg-toff-bg-3 cursor-pointer transition-colors ${i % 2 === 0 ? '' : 'bg-toff-bg/30'}`}
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                          >
                            <td className="px-4 py-3 font-mono text-toff-faint text-xs">#TOFF-{1000 + order.id}</td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-toff-text truncate max-w-[140px]">{order.full_name}</div>
                              <div className="text-xs text-toff-faint truncate max-w-[140px]">{order.user_email}</div>
                            </td>
                            <td className="px-4 py-3 text-toff-muted hidden md:table-cell">
                              {new Date(order.created_at).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-block border text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[order.status] || 'bg-toff-bg-3 text-toff-muted border-toff-border'}`}>
                                {STATUS_LABELS[order.status] || order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-bold text-toff-text hidden sm:table-cell">
                              {parseFloat(order.total_amount).toLocaleString('tr-TR')} ₺
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={(e) => { e.stopPropagation(); navigate(`/admin/orders/${order.id}`); }}
                                className="text-toff-accent hover:text-toff-accent-2 text-xs font-semibold transition-colors"
                              >
                                Detay →
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center py-12 text-toff-faint">Sipariş bulunamadı.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && <AdminProductsPage authTokens={authTokens} />}
          {activeTab === 'coupons' && <AdminCouponsPage authTokens={authTokens} />}
        </main>
      </div>
    </div>
  );
}

export default AdminOrdersPage;
