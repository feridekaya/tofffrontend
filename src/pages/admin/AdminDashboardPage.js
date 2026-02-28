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

const PIE_COLORS = ['#C08B5C', '#E8B07A', '#A0714A', '#D4956A', '#7A5238', '#F0C090', '#B87840', '#6B4226', '#E8A060', '#4A2E18'];

// ── KPI Kartı ────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, trend }) {
    const trendPositive = trend > 0;
    const trendNeutral = trend === 0 || trend == null;
    return (
        <div className="relative bg-gradient-to-br from-toff-bg-2 to-toff-bg-3 border border-toff-border rounded-xl p-5 flex gap-4 items-start hover:border-toff-accent/30 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
            <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-toff-accent to-toff-accent-3 rounded-l-xl" />
            <div className="text-[1.8rem] leading-none shrink-0 mt-0.5">{icon}</div>
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-toff-faint uppercase tracking-[0.6px]">{label}</span>
                <span className="text-2xl font-extrabold text-toff-text tracking-tight">{value}</span>
                {sub && <span className="text-[11px] text-toff-faint">{sub}</span>}
                {!trendNeutral && (
                    <span className={`text-[10px] font-semibold ${trendPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {trendPositive ? '▲' : '▼'} {Math.abs(trend).toFixed(0)} ₺ geçen 30 güne göre
                    </span>
                )}
            </div>
        </div>
    );
}

// ── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-sm shadow-xl">
            <p className="text-toff-text font-bold mb-1.5">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="text-[#9CA3AF] my-0.5">
                    {p.name}: <strong>{
                        typeof p.value === 'number' && p.name?.includes('₺')
                            ? p.value.toLocaleString('tr-TR') + ' ₺'
                            : p.value.toLocaleString('tr-TR')
                    }</strong>
                </p>
            ))}
        </div>
    );
}

function CustomBarLabel({ x, y, width, value }) {
    return (
        <text x={x + width + 8} y={y + 11} fill="#9CA3AF" fontSize={11} textAnchor="start">
            {value} adet
        </text>
    );
}

// ── Ana Bileşen ──────────────────────────────────────────────────────────────
function AdminDashboardPage({ authTokens }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const fetchAnalytics = useCallback(async () => {
        if (!authTokens) return;
        setLoading(true); setError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/analytics/`, {
                headers: { Authorization: `Bearer ${authTokens.access}` },
            });
            setData(res.data);
        } catch {
            setError('Veriler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, [authTokens]);

    useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-toff-muted">
            <div className="w-10 h-10 border-[3px] border-toff-border border-t-toff-accent rounded-full animate-spin" />
            <p>Veriler yükleniyor...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-toff-muted">
            <span className="text-4xl">⚠️</span>
            <p>{error}</p>
            <button onClick={fetchAnalytics} className="border border-toff-accent text-toff-accent px-5 py-2 rounded-lg text-sm font-semibold hover:bg-toff-accent hover:text-black transition-colors">
                Tekrar Dene
            </button>
        </div>
    );

    const { summary, monthly_sales, monthly_users, order_status, low_stock, top_products, category_sales } = data;
    const hasSalesData = monthly_sales?.length > 0;
    const hasUserData = monthly_users?.length > 0;
    const hasStatusData = order_status?.length > 0;
    const hasTopProducts = top_products?.length > 0;
    const hasCategorySales = category_sales?.length > 0;
    const avgTrend = summary.avg_order_value - summary.avg_order_prev;

    const chartCard = 'bg-toff-bg-2 border border-toff-border rounded-xl p-5 hover:border-toff-accent/20 transition-colors';
    const chartTitle = 'text-sm font-bold text-toff-text mb-4 flex items-center gap-2';
    const chartEmpty = 'flex items-center justify-center h-48 text-toff-muted text-sm bg-toff-bg-3 rounded-lg border border-dashed border-toff-border';
    const tabBtn = (key) => `px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === key ? 'border-toff-accent text-toff-accent' : 'border-transparent text-toff-muted hover:text-toff-text'}`;

    return (
        <div className="animate-fade-up pb-10">

            {/* Tabs */}
            <div className="flex gap-1 border-b border-toff-border mb-6">
                <button className={tabBtn('overview')} onClick={() => setActiveTab('overview')}>📊 Genel Bakış</button>
                <button className={tabBtn('products')} onClick={() => setActiveTab('products')}>🏆 Ürün Analizi</button>
                <button className={tabBtn('stock')} onClick={() => setActiveTab('stock')}>
                    ⚠️ Stok
                    {low_stock.length > 0 && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{low_stock.length}</span>
                    )}
                </button>
            </div>

            {/* ── GENEL BAKIŞ ──────────────────────────────────────────────── */}
            {activeTab === 'overview' && (
                <>
                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                        <KpiCard icon="🛒" label="Toplam Sipariş" value={summary.total_orders.toLocaleString('tr-TR')} />
                        <KpiCard icon="💰" label="Toplam Gelir" value={`${summary.total_revenue.toLocaleString('tr-TR', { minimumFractionDigits: 0 })} ₺`} sub="İptal edilenler hariç" />
                        <KpiCard icon="👥" label="Kullanıcı Sayısı" value={summary.total_users.toLocaleString('tr-TR')} />
                        <KpiCard icon="📦" label="Aktif Ürün" value={summary.active_products.toLocaleString('tr-TR')} />
                        <KpiCard icon="🧾" label="Ort. Sipariş Değeri (30 gün)"
                            value={summary.avg_order_value > 0 ? `${summary.avg_order_value.toLocaleString('tr-TR', { minimumFractionDigits: 0 })} ₺` : '—'}
                            trend={summary.avg_order_prev > 0 ? avgTrend : null}
                        />
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Aylık Satış — wide */}
                        <div className={`${chartCard} lg:col-span-2`}>
                            <h3 className={chartTitle}>📈 Aylık Satış Geliri & Sipariş Sayısı</h3>
                            {hasSalesData ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <AreaChart data={monthly_sales} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#C08B5C" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#C08B5C" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colOrd" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#7C6FAD" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#7C6FAD" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                        <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                        <YAxis yAxisId="left" tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                                        <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area yAxisId="left" type="monotone" dataKey="revenue" name="Gelir (₺)" stroke="#C08B5C" strokeWidth={2.5} fill="url(#colRev)" dot={{ r: 4, fill: '#C08B5C' }} />
                                        <Area yAxisId="right" type="monotone" dataKey="orders" name="Sipariş" stroke="#7C6FAD" strokeWidth={2} fill="url(#colOrd)" dot={{ r: 3, fill: '#7C6FAD' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : <div className={chartEmpty}>Henüz satış verisi yok.</div>}
                        </div>

                        {/* Sipariş Durum Pasta */}
                        <div className={chartCard}>
                            <h3 className={chartTitle}>🍩 Sipariş Durumları</h3>
                            {hasStatusData ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={order_status} cx="50%" cy="44%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                                            {order_status.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <PieTooltip formatter={(v, n) => [v, n]} contentStyle={{ background: '#1F1F1F', border: '1px solid #333', borderRadius: 6 }} itemStyle={{ color: '#EDEDED' }} />
                                        <PieLegend wrapperStyle={{ fontSize: 11 }} formatter={v => <span style={{ color: '#9CA3AF' }}>{v}</span>} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <div className={chartEmpty}>Henüz sipariş verisi yok.</div>}
                        </div>

                        {/* Kategori Pasta */}
                        <div className={chartCard}>
                            <h3 className={chartTitle}>🗂️ Kategori Bazlı Satış</h3>
                            {hasCategorySales ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={category_sales} cx="50%" cy="44%" outerRadius={90} paddingAngle={2} dataKey="value">
                                            {category_sales.map((_, i) => <Cell key={i} fill={PIE_COLORS[(i + 3) % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <PieTooltip formatter={(v, n) => [`${v} adet`, n]} contentStyle={{ background: '#1F1F1F', border: '1px solid #333', borderRadius: 6 }} itemStyle={{ color: '#EDEDED' }} />
                                        <PieLegend wrapperStyle={{ fontSize: 11 }} formatter={v => <span style={{ color: '#9CA3AF' }}>{v}</span>} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <div className={chartEmpty}>Kategori verisi yok.</div>}
                        </div>

                        {/* Aylık Kullanıcı — wide */}
                        <div className={`${chartCard} lg:col-span-2`}>
                            <h3 className={chartTitle}>👤 Aylık Yeni Kullanıcı Kayıtları</h3>
                            {hasUserData ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={monthly_users} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                        <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                        <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} allowDecimals={false} />
                                        <Tooltip contentStyle={{ background: '#1F1F1F', border: '1px solid #333', borderRadius: 6 }} labelStyle={{ color: '#EDEDED' }} formatter={v => [v, 'Yeni Kullanıcı']} />
                                        <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                                            {monthly_users.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? '#C08B5C' : '#E8B07A'} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : <div className={chartEmpty}>Henüz kullanıcı verisi yok.</div>}
                        </div>
                    </div>
                </>
            )}

            {/* ── ÜRÜN ANALİZİ ─────────────────────────────────────────────── */}
            {activeTab === 'products' && (
                <div className="grid grid-cols-1 gap-5">
                    {/* Yatay Bar */}
                    <div className={chartCard}>
                        <h3 className={chartTitle}>🏆 En Çok Satan 5 Ürün</h3>
                        {hasTopProducts ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={top_products} layout="vertical" margin={{ top: 5, right: 80, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={false} />
                                    <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} allowDecimals={false} />
                                    <YAxis type="category" dataKey="name" width={150} tick={{ fill: '#EDEDED', fontSize: 12 }}
                                        tickFormatter={v => v.length > 20 ? v.slice(0, 20) + '…' : v} />
                                    <Tooltip contentStyle={{ background: '#1F1F1F', border: '1px solid #333', borderRadius: 6 }}
                                        formatter={(v, n) => n === 'quantity' ? [`${v} adet`, 'Satış'] : [`${v.toLocaleString('tr-TR')} ₺`, 'Ciro']}
                                        itemStyle={{ color: '#EDEDED' }} />
                                    <Bar dataKey="quantity" radius={[0, 6, 6, 0]} label={<CustomBarLabel />}>
                                        {top_products.map((_, i) => <Cell key={i} fill={i === 0 ? '#C08B5C' : i === 1 ? '#E8B07A' : i === 2 ? '#A0714A' : '#7A5238'} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className={chartEmpty}>Henüz sipariş verisi yok.</div>}
                    </div>

                    {/* Kategori Pasta büyük */}
                    <div className={chartCard}>
                        <h3 className={chartTitle}>🗂️ Kategori Bazlı Satış Dağılımı</h3>
                        {hasCategorySales ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={category_sales} cx="50%" cy="46%" outerRadius={110} paddingAngle={3} dataKey="value"
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={{ stroke: '#555' }}>
                                        {category_sales.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                    </Pie>
                                    <PieTooltip formatter={(v, n) => [`${v} adet`, n]} contentStyle={{ background: '#1F1F1F', border: '1px solid #333', borderRadius: 6 }} itemStyle={{ color: '#EDEDED' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <div className={chartEmpty}>Kategori verisi yok.</div>}
                    </div>

                    {/* Tablo */}
                    {hasTopProducts && (
                        <div className={chartCard}>
                            <h3 className={chartTitle}>📋 En Çok Satan Ürünler — Detay</h3>
                            <div className="overflow-x-auto rounded-lg border border-toff-border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-toff-border bg-toff-bg/60">
                                            <th className="text-left px-4 py-3 text-[11px] font-bold text-toff-faint uppercase tracking-wider">Sıra</th>
                                            <th className="text-left px-4 py-3 text-[11px] font-bold text-toff-faint uppercase tracking-wider">Ürün</th>
                                            <th className="text-left px-4 py-3 text-[11px] font-bold text-toff-faint uppercase tracking-wider">Satış</th>
                                            <th className="text-left px-4 py-3 text-[11px] font-bold text-toff-faint uppercase tracking-wider">Ciro</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {top_products.map((p, i) => (
                                            <tr key={p.id} className="border-b border-toff-border/40 hover:bg-toff-bg-3 transition-colors">
                                                <td className="px-4 py-3 text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</td>
                                                <td className="px-4 py-3 text-toff-text">{p.name}</td>
                                                <td className="px-4 py-3 font-semibold text-toff-text">{p.quantity} adet</td>
                                                <td className="px-4 py-3 font-bold text-toff-text">{p.revenue.toLocaleString('tr-TR')} ₺</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── STOK ──────────────────────────────────────────────────────── */}
            {activeTab === 'stock' && (
                <div className={chartCard}>
                    <h3 className={chartTitle}>
                        ⚠️ Düşük Stok Uyarısı
                        {low_stock.length > 0 && (
                            <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">{low_stock.length}</span>
                        )}
                    </h3>
                    {low_stock.length === 0 ? (
                        <div className="flex items-center justify-center h-24 text-green-400 text-sm bg-green-900/10 rounded-lg border border-dashed border-green-800">
                            ✅ Tüm ürünlerin stoğu yeterli (≥ 5 adet)
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-toff-border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-toff-border bg-toff-bg/60">
                                        <th className="text-left px-4 py-3 text-[11px] font-bold text-toff-faint uppercase tracking-wider">#</th>
                                        <th className="text-left px-4 py-3 text-[11px] font-bold text-toff-faint uppercase tracking-wider">Ürün Adı</th>
                                        <th className="text-left px-4 py-3 text-[11px] font-bold text-toff-faint uppercase tracking-wider">Stok</th>
                                        <th className="text-left px-4 py-3 text-[11px] font-bold text-toff-faint uppercase tracking-wider">Fiyat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {low_stock.map(p => (
                                        <tr key={p.id} className={`border-b border-toff-border/40 transition-colors ${p.stock === 0 ? 'bg-red-900/10' : 'hover:bg-toff-bg-3'}`}>
                                            <td className="px-4 py-3 font-mono text-toff-faint text-xs">{p.id}</td>
                                            <td className="px-4 py-3 text-toff-text">{p.name}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${p.stock === 0 ? 'bg-red-900/40 text-red-400 border-red-700/50' : 'bg-yellow-900/30 text-yellow-400 border-yellow-700/40'}`}>
                                                    {p.stock === 0 ? '🔴 Tükendi' : `⚠️ ${p.stock} adet`}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-toff-text">{p.price.toLocaleString('tr-TR')} ₺</td>
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
