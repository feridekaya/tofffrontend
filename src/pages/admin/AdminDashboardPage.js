// src/pages/admin/AdminDashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    AreaChart, Area,
    BarChart, Bar,
    PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import API_BASE_URL from '../../config/api';
import './AdminDashboardPage.css';

// ── Renk Paleti ─────────────────────────────────────────────────────────────
const PIE_COLORS = [
    '#C08B5C', '#E8B07A', '#A0714A', '#D4956A',
    '#7A5238', '#F0C090', '#B87840', '#6B4226',
    '#E8A060', '#4A2E18',
];

// ── KPI Kartı ────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, trend }) {
    const trendPositive = trend > 0;
    const trendNeutral = trend === 0 || trend === null || trend === undefined;
    return (
        <div className="kpi-card">
            <div className="kpi-icon">{icon}</div>
            <div className="kpi-body">
                <span className="kpi-label">{label}</span>
                <span className="kpi-value">{value}</span>
                {sub && <span className="kpi-sub">{sub}</span>}
                {!trendNeutral && (
                    <span className={`kpi-trend ${trendPositive ? 'trend-up' : 'trend-down'}`}>
                        {trendPositive ? '▲' : '▼'} {Math.abs(trend).toFixed(0)} ₺ geçen 30 güne göre
                    </span>
                )}
            </div>
        </div>
    );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="chart-tooltip">
            <p className="tooltip-label">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="tooltip-entry" style={{ color: p.color }}>
                    {p.name}: <strong>{typeof p.value === 'number' && p.name?.includes('₺')
                        ? p.value.toLocaleString('tr-TR', { minimumFractionDigits: 0 }) + ' ₺'
                        : p.value.toLocaleString('tr-TR')}</strong>
                </p>
            ))}
        </div>
    );
}

// ── Custom Horizontal Bar Label ───────────────────────────────────────────────
function CustomBarLabel({ x, y, width, value, name }) {
    return (
        <text x={x + width + 8} y={y + 11} fill="#9CA3AF" fontSize={11} textAnchor="start">
            {value} adet
        </text>
    );
}

// ── Ana Bileşen ───────────────────────────────────────────────────────────────
function AdminDashboardPage({ authTokens }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'stock'

    const fetchAnalytics = useCallback(async () => {
        if (!authTokens) return;
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/analytics/`, {
                headers: { Authorization: `Bearer ${authTokens.access}` },
            });
            setData(res.data);
        } catch (err) {
            console.error('Analytics verisi alınamadı:', err);
            setError('Veriler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, [authTokens]);

    useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="dashboard-spinner" />
                <p>Veriler yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <span>⚠️</span>
                <p>{error}</p>
                <button onClick={fetchAnalytics} className="retry-btn">Tekrar Dene</button>
            </div>
        );
    }

    const { summary, monthly_sales, monthly_users, order_status, low_stock, top_products, category_sales } = data;

    const hasSalesData = monthly_sales?.length > 0;
    const hasUserData = monthly_users?.length > 0;
    const hasStatusData = order_status?.length > 0;
    const hasTopProducts = top_products?.length > 0;
    const hasCategorySales = category_sales?.length > 0;

    const avgTrend = summary.avg_order_value - summary.avg_order_prev;

    return (
        <div className="dashboard-root">

            {/* ── Tab Navigasyon ────────────────────────────────────────── */}
            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'overview' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >📊 Genel Bakış</button>
                <button
                    className={`tab-btn ${activeTab === 'products' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >🏆 Ürün Analizi</button>
                <button
                    className={`tab-btn ${activeTab === 'stock' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('stock')}
                >⚠️ Stok Durumu {low_stock.length > 0 && <span className="tab-badge">{low_stock.length}</span>}</button>
            </div>

            {/* ── GENEL BAKIŞ ───────────────────────────────────────────── */}
            {activeTab === 'overview' && (
                <>
                    {/* KPI Kartları */}
                    <div className="kpi-grid">
                        <KpiCard
                            icon="🛒"
                            label="Toplam Sipariş"
                            value={summary.total_orders.toLocaleString('tr-TR')}
                        />
                        <KpiCard
                            icon="💰"
                            label="Toplam Gelir"
                            value={summary.total_revenue.toLocaleString('tr-TR', { minimumFractionDigits: 0 }) + ' ₺'}
                            sub="İptal edilenler hariç"
                        />
                        <KpiCard
                            icon="👥"
                            label="Kullanıcı Sayısı"
                            value={summary.total_users.toLocaleString('tr-TR')}
                        />
                        <KpiCard
                            icon="📦"
                            label="Aktif Ürün"
                            value={summary.active_products.toLocaleString('tr-TR')}
                        />
                        <KpiCard
                            icon="🧾"
                            label="Ort. Sipariş Değeri (30 gün)"
                            value={summary.avg_order_value > 0
                                ? summary.avg_order_value.toLocaleString('tr-TR', { minimumFractionDigits: 0 }) + ' ₺'
                                : '—'}
                            trend={summary.avg_order_prev > 0 ? avgTrend : null}
                        />
                    </div>

                    {/* Grafikler */}
                    <div className="charts-grid">

                        {/* Aylık Satış Geliri */}
                        <div className="chart-card chart-wide">
                            <h3 className="chart-title">📈 Aylık Satış Geliri & Sipariş Sayısı</h3>
                            {hasSalesData ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <AreaChart data={monthly_sales} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#C08B5C" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#C08B5C" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#7C6FAD" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#7C6FAD" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                        <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                        <YAxis yAxisId="left" tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                            tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                                        <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area yAxisId="left" type="monotone" dataKey="revenue"
                                            name="Gelir (₺)" stroke="#C08B5C" strokeWidth={2.5}
                                            fill="url(#colorRevenue)" dot={{ r: 4, fill: '#C08B5C' }} />
                                        <Area yAxisId="right" type="monotone" dataKey="orders"
                                            name="Sipariş" stroke="#7C6FAD" strokeWidth={2}
                                            fill="url(#colorOrders)" dot={{ r: 3, fill: '#7C6FAD' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="chart-empty">Henüz satış verisi yok.</div>
                            )}
                        </div>

                        {/* Sipariş Durum Pasta */}
                        <div className="chart-card">
                            <h3 className="chart-title">🍩 Sipariş Durumları</h3>
                            {hasStatusData ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie
                                            data={order_status}
                                            cx="50%"
                                            cy="45%"
                                            innerRadius={60}
                                            outerRadius={95}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {order_status.map((entry, index) => (
                                                <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <PieTooltip
                                            formatter={(value, name) => [value, name]}
                                            contentStyle={{ background: '#1F1F1F', border: '1px solid #333', borderRadius: 6 }}
                                            labelStyle={{ color: '#EDEDED' }}
                                            itemStyle={{ color: '#EDEDED' }}
                                        />
                                        <PieLegend
                                            wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }}
                                            formatter={(value) => <span style={{ color: '#9CA3AF' }}>{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="chart-empty">Henüz sipariş verisi yok.</div>
                            )}
                        </div>

                        {/* Kategori Bazlı Satış */}
                        <div className="chart-card">
                            <h3 className="chart-title">🗂️ Kategori Bazlı Satış Dağılımı</h3>
                            {hasCategorySales ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie
                                            data={category_sales}
                                            cx="50%"
                                            cy="45%"
                                            outerRadius={95}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {category_sales.map((entry, index) => (
                                                <Cell key={index} fill={PIE_COLORS[(index + 3) % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <PieTooltip
                                            formatter={(value, name) => [`${value} adet`, name]}
                                            contentStyle={{ background: '#1F1F1F', border: '1px solid #333', borderRadius: 6 }}
                                            itemStyle={{ color: '#EDEDED' }}
                                        />
                                        <PieLegend
                                            wrapperStyle={{ fontSize: 11 }}
                                            formatter={(value) => <span style={{ color: '#9CA3AF' }}>{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="chart-empty">Kategori verisi yok.</div>
                            )}
                        </div>

                        {/* Aylık Yeni Kullanıcı */}
                        <div className="chart-card chart-wide">
                            <h3 className="chart-title">👤 Aylık Yeni Kullanıcı Kayıtları</h3>
                            {hasUserData ? (
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={monthly_users} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                        <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                        <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{ background: '#1F1F1F', border: '1px solid #333', borderRadius: 6 }}
                                            labelStyle={{ color: '#EDEDED' }}
                                            itemStyle={{ color: '#EDEDED' }}
                                            formatter={(v) => [v, 'Yeni Kullanıcı']}
                                        />
                                        <Bar dataKey="users" name="Yeni Kullanıcı" radius={[4, 4, 0, 0]}>
                                            {monthly_users.map((_, i) => (
                                                <Cell key={i} fill={i % 2 === 0 ? '#C08B5C' : '#E8B07A'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="chart-empty">Henüz kullanıcı verisi yok.</div>
                            )}
                        </div>

                    </div>
                </>
            )}

            {/* ── ÜRÜN ANALİZİ ─────────────────────────────────────────── */}
            {activeTab === 'products' && (
                <div className="charts-grid">

                    {/* En Çok Satan 5 Ürün - Yatay Bar */}
                    <div className="chart-card chart-wide">
                        <h3 className="chart-title">🏆 En Çok Satan 5 Ürün</h3>
                        {hasTopProducts ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={top_products}
                                    layout="vertical"
                                    margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={false} />
                                    <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} allowDecimals={false} />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        width={160}
                                        tick={{ fill: '#EDEDED', fontSize: 12 }}
                                        tickFormatter={(v) => v.length > 22 ? v.slice(0, 22) + '…' : v}
                                    />
                                    <Tooltip
                                        contentStyle={{ background: '#1F1F1F', border: '1px solid #333', borderRadius: 6 }}
                                        formatter={(value, name) => {
                                            if (name === 'quantity') return [`${value} adet`, 'Satış Adedi'];
                                            return [`${value.toLocaleString('tr-TR')} ₺`, 'Ciro'];
                                        }}
                                        itemStyle={{ color: '#EDEDED' }}
                                    />
                                    <Bar dataKey="quantity" name="quantity" radius={[0, 6, 6, 0]}
                                        label={<CustomBarLabel />}>
                                        {top_products.map((_, i) => (
                                            <Cell key={i}
                                                fill={i === 0 ? '#C08B5C' : i === 1 ? '#E8B07A' : i === 2 ? '#A0714A' : '#7A5238'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="chart-empty">Henüz sipariş verisi yok.</div>
                        )}
                    </div>

                    {/* En Çok Satan Ürünler Tablo */}
                    {hasTopProducts && (
                        <div className="chart-card chart-wide">
                            <h3 className="chart-title">📋 En Çok Satan Ürünler — Detay</h3>
                            <div className="low-stock-table-wrap">
                                <table className="low-stock-table">
                                    <thead>
                                        <tr>
                                            <th>Sıra</th>
                                            <th>Ürün Adı</th>
                                            <th>Satış Adedi</th>
                                            <th>Toplam Ciro</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {top_products.map((p, i) => (
                                            <tr key={p.id}>
                                                <td className="font-mono">
                                                    <span className={`rank-badge rank-${i + 1}`}>
                                                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                                    </span>
                                                </td>
                                                <td>{p.name}</td>
                                                <td><strong>{p.quantity}</strong> adet</td>
                                                <td className="font-bold">{p.revenue.toLocaleString('tr-TR')} ₺</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Kategori Bazlı Pasta */}
                    <div className="chart-card chart-wide">
                        <h3 className="chart-title">🗂️ Kategori Bazlı Satış Dağılımı</h3>
                        {hasCategorySales ? (
                            <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                    <Pie
                                        data={category_sales}
                                        cx="50%"
                                        cy="46%"
                                        outerRadius={120}
                                        paddingAngle={3}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        labelLine={{ stroke: '#555' }}
                                    >
                                        {category_sales.map((entry, index) => (
                                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <PieTooltip
                                        formatter={(value, name) => [`${value} adet`, name]}
                                        contentStyle={{ background: '#1F1F1F', border: '1px solid #333', borderRadius: 6 }}
                                        itemStyle={{ color: '#EDEDED' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="chart-empty">Kategori verisi yok.</div>
                        )}
                    </div>

                </div>
            )}

            {/* ── STOK DURUMU ──────────────────────────────────────────── */}
            {activeTab === 'stock' && (
                <div className="low-stock-section">
                    <h3 className="chart-title">
                        ⚠️ Düşük Stok Uyarısı
                        {low_stock.length > 0 && (
                            <span className="low-stock-badge">{low_stock.length}</span>
                        )}
                    </h3>
                    {low_stock.length === 0 ? (
                        <div className="chart-empty no-alert">✅ Tüm ürünlerin stoğu yeterli (≥ 5 adet)</div>
                    ) : (
                        <div className="low-stock-table-wrap">
                            <table className="low-stock-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Ürün Adı</th>
                                        <th>Stok</th>
                                        <th>Fiyat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {low_stock.map(p => (
                                        <tr key={p.id} className={p.stock === 0 ? 'stock-zero' : 'stock-low'}>
                                            <td className="font-mono">{p.id}</td>
                                            <td>{p.name}</td>
                                            <td>
                                                <span className={`stock-chip ${p.stock === 0 ? 'chip-danger' : 'chip-warn'}`}>
                                                    {p.stock === 0 ? '🔴 Tükendi' : `⚠️ ${p.stock} adet`}
                                                </span>
                                            </td>
                                            <td className="font-bold">{p.price.toLocaleString('tr-TR')} ₺</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

export default AdminDashboardPage;
