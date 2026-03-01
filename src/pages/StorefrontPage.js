// frontend/src/pages/StorefrontPage.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import heroImg from '../assets/storefront-hero.png';

// Kategori için fallback renk/gradient (görsel yoksa)
const CAT_GRADIENTS = [
    'from-stone-900 to-stone-700',
    'from-zinc-900 to-zinc-700',
    'from-neutral-900 to-neutral-700',
    'from-slate-900 to-slate-700',
    'from-gray-900 to-gray-700',
    'from-stone-800 to-amber-900',
    'from-zinc-800 to-stone-600',
];

// Ana kategori sırası (slug'larla eşleşir)
const MENU_ORDER = [
    'masalar', 'oturma-elemanlari', 'sehpalar',
    'sergileme-duzenleme', 'dis-mekan', 'mekan-cozumleri', 'little-paws',
];

export default function StorefrontPage() {
    const { handleAddToCart: onAddToCart, favorites, toggleFavorite } = useAuth();
    const [categories, setCategories] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const carouselRef = useRef(null);

    useEffect(() => {
        // Ana kategorileri çek
        axios.get(`${API_BASE_URL}/api/categories/`)
            .then(res => {
                const mainCats = res.data.filter(c => c.parent === null);
                const sorted = [...mainCats].sort((a, b) => {
                    const ia = MENU_ORDER.indexOf(a.slug);
                    const ib = MENU_ORDER.indexOf(b.slug);
                    if (ia === -1 && ib === -1) return 0;
                    if (ia === -1) return 1;
                    if (ib === -1) return -1;
                    return ia - ib;
                });
                setCategories(sorted);
            })
            .catch(() => { });

        // Bestsellers: en son eklenen aktif ürünler
        axios.get(`${API_BASE_URL}/api/products/?ordering=-id&is_active=true&page_size=8`)
            .then(res => {
                const items = res.data.results || res.data;
                setBestsellers(items.slice(0, 8));
            })
            .catch(() => { });
    }, []);

    const scrollCarousel = (dir) => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
        }
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) setSubscribed(true);
    };

    return (
        <div className="min-h-screen bg-toff-bg">

            {/* ══════════════════════════════════════════
          1. HERO BANNER
      ══════════════════════════════════════════ */}
            <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
                {/* Arka plan görseli */}
                <img
                    src={heroImg}
                    alt="Toff Storefront"
                    className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-[8000ms] hover:scale-100"
                    onError={e => { e.target.style.display = 'none'; }}
                />
                {/* Koyu overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-toff-bg via-transparent to-transparent" />

                {/* İçerik */}
                <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
                    <div className="max-w-xl animate-fade-up">
                        <p className="text-xs font-bold tracking-[0.4em] text-toff-accent uppercase mb-4">
                            Yeni Sezon · 2025
                        </p>
                        <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-5">
                            Minimalist<br />
                            <span className="text-toff-accent">Metal</span> Koleksiyonu
                        </h1>
                        <p className="text-toff-muted text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                            Evinizin ruhunu değiştirecek yeni tasarımları keşfedin. Endüstriyel zarafetle ev konforu bir arada.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/koleksiyonlar"
                                className="flex items-center gap-2 bg-toff-accent hover:bg-toff-accent-3 text-white font-bold px-7 py-3.5 rounded-xl tracking-wider text-sm transition-all"
                            >
                                Koleksiyonu İncele <FaArrowRight size={12} />
                            </Link>
                            <Link
                                to="/tum-urunler"
                                className="flex items-center gap-2 border border-toff-border text-toff-muted hover:text-toff-text hover:border-toff-muted font-bold px-7 py-3.5 rounded-xl tracking-wider text-sm transition-all"
                            >
                                Tüm Ürünler
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Alt dekoratif çizgi */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-toff-accent/40 to-transparent" />
            </section>

            {/* ══════════════════════════════════════════
          2. KATEGORİLERE GÖRE ALIŞVERİŞ
      ══════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="text-xs font-bold tracking-[0.3em] text-toff-accent uppercase mb-2">Koleksiyonlar</p>
                        <h2 className="text-2xl sm:text-3xl font-black text-toff-text">Kategorilere Göre Alışveriş</h2>
                    </div>
                    <Link to="/tum-urunler" className="text-xs text-toff-muted hover:text-toff-accent flex items-center gap-1 transition-colors">
                        Tümünü Gör <FaArrowRight size={10} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {categories.map((cat, i) => (
                        <Link
                            key={cat.id}
                            to={`/${cat.slug}`}
                            className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                        >
                            {/* Görsel veya gradient fallback */}
                            {cat.image_url ? (
                                <img
                                    src={cat.image_url}
                                    alt={cat.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className={`absolute inset-0 bg-gradient-to-br ${CAT_GRADIENTS[i % CAT_GRADIENTS.length]}`} />
                            )}
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            {/* Hover renk katmanı */}
                            <div className="absolute inset-0 bg-toff-accent/0 group-hover:bg-toff-accent/10 transition-colors duration-500" />
                            {/* İçerik */}
                            <div className="absolute inset-0 flex flex-col items-center justify-end pb-5 px-3">
                                <p className="text-white font-bold text-center text-xs sm:text-sm tracking-widest uppercase drop-shadow">
                                    {cat.name}
                                </p>
                                <div className="w-6 h-px bg-toff-accent mt-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            </div>
                        </Link>
                    ))}

                    {/* Tüm Ürünler kartı */}
                    <Link
                        to="/tum-urunler"
                        className="group relative aspect-square rounded-2xl overflow-hidden border border-toff-border bg-toff-bg-2 hover:border-toff-accent/40 transition-colors flex flex-col items-center justify-center gap-3"
                    >
                        <div className="w-12 h-12 bg-toff-accent/10 rounded-full flex items-center justify-center text-toff-accent group-hover:bg-toff-accent/20 transition-colors">
                            <FaArrowRight size={18} />
                        </div>
                        <p className="text-xs font-bold tracking-widest text-toff-muted group-hover:text-toff-accent uppercase transition-colors">
                            Tüm Ürünler
                        </p>
                    </Link>
                </div>
            </section>

            {/* ══════════════════════════════════════════
          3. SPLIT PROMO BANNERLAR
      ══════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Sol: Özel Ölçü */}
                    <Link to="/kurumsal-satis" className="group relative rounded-2xl overflow-hidden h-52 sm:h-64 bg-toff-bg-2 border border-toff-border hover:border-toff-accent/30 transition-colors flex items-center px-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-toff-bg-2 via-toff-bg-3 to-zinc-900" />
                        <div className="relative z-10">
                            <p className="text-xs tracking-[0.3em] text-toff-accent uppercase font-bold mb-2">Kurumsal & Projeler</p>
                            <h3 className="text-xl sm:text-2xl font-black text-toff-text mb-3 max-w-xs leading-tight">
                                Özel Ölçü & <span className="text-toff-accent">Proje</span> Siparişleri
                            </h3>
                            <p className="text-xs text-toff-muted max-w-xs leading-relaxed mb-4">
                                Mekan çözümleri, otel ve restoran projeleri, kurumsal hediyeler.
                            </p>
                            <span className="flex items-center gap-1 text-xs font-bold text-toff-accent group-hover:gap-2 transition-all">
                                Detaylı bilgi <FaArrowRight size={10} />
                            </span>
                        </div>
                        {/* Dekoratif köşe çizgisi */}
                        <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-toff-accent/20 group-hover:border-toff-accent/50 transition-colors rounded-tr-lg" />
                        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-toff-accent/20 group-hover:border-toff-accent/50 transition-colors rounded-bl-lg" />
                    </Link>

                    {/* Sağ: Toff Promise */}
                    <Link to="/toff-promise" className="group relative rounded-2xl overflow-hidden h-52 sm:h-64 bg-toff-bg-2 border border-toff-accent/20 hover:border-toff-accent/50 transition-colors flex items-center px-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/40 via-toff-bg-2 to-toff-bg-3" />
                        <div className="absolute inset-0 opacity-5"
                            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C08B5C 0, #C08B5C 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }}
                        />
                        <div className="relative z-10">
                            <p className="text-xs tracking-[0.3em] text-toff-accent uppercase font-bold mb-2">Manifesto</p>
                            <h3 className="text-xl sm:text-2xl font-black text-toff-text mb-3 leading-tight">
                                The Toff <span className="text-toff-accent">Promise</span>
                            </h3>
                            <p className="text-xs text-toff-muted max-w-xs leading-relaxed mb-4">
                                Sürdürülebilirlik, yerel üretim, nesilden nesile aktarılan kalite.
                            </p>
                            <span className="flex items-center gap-1 text-xs font-bold text-toff-accent group-hover:gap-2 transition-all">
                                Manifestoyu oku <FaArrowRight size={10} />
                            </span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* ══════════════════════════════════════════
          4. BESTSELLERS CAROUSEL
      ══════════════════════════════════════════ */}
            {bestsellers.length > 0 && (
                <section className="pb-16 bg-toff-bg-2/40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <p className="text-xs font-bold tracking-[0.3em] text-toff-accent uppercase mb-2">Öne Çıkanlar</p>
                                <h2 className="text-2xl sm:text-3xl font-black text-toff-text">Çok Satanlar</h2>
                            </div>
                            {/* Carousel kontrolleri */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => scrollCarousel(-1)}
                                    className="w-9 h-9 border border-toff-border text-toff-muted hover:text-toff-accent hover:border-toff-accent/40 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <FaChevronLeft size={12} />
                                </button>
                                <button
                                    onClick={() => scrollCarousel(1)}
                                    className="w-9 h-9 border border-toff-border text-toff-muted hover:text-toff-accent hover:border-toff-accent/40 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <FaChevronRight size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable row */}
                        <div
                            ref={carouselRef}
                            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {bestsellers.map(product => (
                                <div key={product.id} className="snap-start shrink-0 w-64 sm:w-72">
                                    <ProductCard
                                        product={product}
                                        onAddToCart={onAddToCart}
                                        isFavorited={favorites?.includes(product.id)}
                                        onToggleFavorite={() => toggleFavorite(product.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ══════════════════════════════════════════
          5. NEWSLETTER CTA
      ══════════════════════════════════════════ */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
                <div className="w-12 h-12 bg-toff-accent/10 text-toff-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <HiOutlineMail size={24} />
                </div>
                <p className="text-xs font-bold tracking-[0.3em] text-toff-accent uppercase mb-3">Bülten</p>
                <h2 className="text-2xl sm:text-3xl font-black text-toff-text mb-4">
                    Toff Dünyasına Katılın
                </h2>
                <p className="text-toff-muted leading-relaxed mb-8 max-w-md mx-auto">
                    Yeni tasarımlardan, özel kampanyalardan ve indirimlerden ilk siz haberdar olun.
                </p>

                {subscribed ? (
                    <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-700/40 text-green-400 font-bold px-6 py-3 rounded-xl text-sm">
                        ✓ Abone oldunuz, teşekkürler!
                    </div>
                ) : (
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="E-posta adresiniz"
                            className="flex-1 bg-toff-bg border border-toff-border focus:border-toff-accent text-toff-text placeholder-toff-faint rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                        />
                        <button
                            type="submit"
                            className="bg-toff-accent hover:bg-toff-accent-3 text-white font-bold px-6 py-3 rounded-xl text-sm tracking-wider transition-colors whitespace-nowrap"
                        >
                            Abone Ol
                        </button>
                    </form>
                )}
                <p className="text-xs text-toff-faint mt-4">Spam yok. İstediğiniz zaman abonelikten çıkabilirsiniz.</p>
            </section>

        </div>
    );
}
