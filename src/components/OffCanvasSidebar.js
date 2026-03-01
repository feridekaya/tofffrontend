import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTimes, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import productService from '../services/productService';

// Kullanıcının istediği kategori sırası ve slug eşleşmeleri
const CATEGORY_ORDER = [
    'koleksiyonlar',
    'masalar',
    'oturma-elemanlari',
    'sehpalar',
    'servis-uniteleri',
    'dis-mekan-bahce',
    'sergileme-duzenleme',
    'mekan-cozumleri',
    'little-paws',
];

function OffCanvasSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [collections, setCollections] = useState([]);
    const [categories, setCategories] = useState([]);
    const [expanded, setExpanded] = useState({});
    const location = useLocation();

    // Route değişince kapat
    useEffect(() => { setIsOpen(false); }, [location]);

    // Scroll kilidi
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // API'dan veri çek
    useEffect(() => {
        productService.getCollections()
            .then(res => setCollections(res.data))
            .catch(err => console.error('Koleksiyonlar yüklenemedi:', err));

        productService.getCategories()
            .then(res => {
                const all = res.data;
                const parents = all.filter(c => c.parent === null);
                const withSubs = parents.map(p => ({
                    ...p,
                    subCategories: all.filter(c => c.parent === p.id),
                }));

                // Kullanıcının belirlediği sıraya göre sırala
                withSubs.sort((a, b) => {
                    const ia = CATEGORY_ORDER.indexOf(a.slug);
                    const ib = CATEGORY_ORDER.indexOf(b.slug);
                    if (ia === -1 && ib === -1) return 0;
                    if (ia === -1) return 1;
                    if (ib === -1) return -1;
                    return ia - ib;
                });

                setCategories(withSubs);
            })
            .catch(err => console.error('Kategoriler yüklenemedi:', err));
    }, []);

    const toggleExpand = (slug) => {
        setExpanded(prev => ({ ...prev, [slug]: !prev[slug] }));
    };

    const navLinkClass = 'flex items-center justify-between px-3 py-2.5 text-xs font-bold tracking-wider text-toff-muted hover:text-toff-accent hover:bg-toff-bg-3 rounded-lg transition-colors uppercase';
    const subLinkClass = 'block px-3 py-2 text-[11px] text-toff-faint hover:text-toff-accent hover:bg-toff-bg-3 rounded-lg transition-colors ml-3';

    return (
        <>
            {/* Hamburger Butonu */}
            <button
                aria-label="Menüyü Aç"
                onClick={() => setIsOpen(true)}
                className="flex flex-col gap-1.5 p-2 group text-toff-muted"
            >
                <span className="w-6 h-0.5 bg-current block transition-all group-hover:bg-toff-accent" />
                <span className="w-4 h-0.5 bg-current block transition-all group-hover:bg-toff-accent" />
                <span className="w-6 h-0.5 bg-current block transition-all group-hover:bg-toff-accent" />
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Panel */}
            <div className={`fixed top-0 left-0 h-full w-72 bg-toff-bg-2 border-r border-toff-border z-50 flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Başlık */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-toff-border">
                    <Link to="/" className="text-lg font-black tracking-[0.3em] text-toff-accent">TOFF</Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-toff-muted hover:text-toff-text transition-colors p-1"
                        aria-label="Kapat"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Navigasyon */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">

                    {/* Kategoriler Başlığı */}
                    <p className="text-[10px] font-bold text-toff-faint uppercase tracking-widest mb-2 px-2">Kategoriler</p>

                    {/* Koleksiyonlar (API'dan öne sabit) */}
                    <div className="mb-0.5">
                        <button
                            onClick={() => toggleExpand('koleksiyonlar')}
                            className={navLinkClass + ' w-full'}
                        >
                            <span>KOLEKSİYONLAR</span>
                            {collections.length > 0 && (
                                expanded['koleksiyonlar']
                                    ? <FaChevronDown size={10} className="text-toff-faint" />
                                    : <FaChevronRight size={10} className="text-toff-faint" />
                            )}
                        </button>

                        {expanded['koleksiyonlar'] && collections.length > 0 && (
                            <div className="mt-0.5 flex flex-col gap-0.5 mb-1">
                                <Link to="/koleksiyonlar" className={subLinkClass}>
                                    TÜM KOLEKSİYONLAR
                                </Link>
                                {collections.map(col => (
                                    <Link key={col.id} to={`/koleksiyon/${col.slug}`} className={subLinkClass}>
                                        {col.name.toUpperCase()}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dinamik Kategoriler (API sırası: kullanıcı belirledi) */}
                    {categories.map(cat => (
                        <div key={cat.id} className="mb-0.5">
                            {cat.subCategories.length > 0 ? (
                                <>
                                    <button
                                        onClick={() => toggleExpand(cat.slug)}
                                        className={navLinkClass + ' w-full'}
                                    >
                                        {cat.name.toUpperCase()}
                                        {expanded[cat.slug]
                                            ? <FaChevronDown size={10} className="text-toff-faint" />
                                            : <FaChevronRight size={10} className="text-toff-faint" />
                                        }
                                    </button>
                                    {expanded[cat.slug] && (
                                        <div className="mt-0.5 flex flex-col gap-0.5 mb-1">
                                            <Link to={`/${cat.slug}`} className={subLinkClass}>
                                                TÜMÜNÜ GÖR
                                            </Link>
                                            {cat.subCategories.map(sub => (
                                                <Link key={sub.id} to={`/${cat.slug}/${sub.slug}`} className={subLinkClass}>
                                                    {sub.name.toUpperCase()}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link to={`/${cat.slug}`} className={navLinkClass + ' block'}>
                                    {cat.name.toUpperCase()}
                                </Link>
                            )}
                        </div>
                    ))}

                    {/* Tüm Ürünler (sona sabit) */}
                    <div className="mt-1">
                        <Link to="/tum-urunler" className={navLinkClass + ' block'}>
                            TÜM ÜRÜNLER
                        </Link>
                    </div>

                    {/* Kurumsal Bölümü */}
                    <div className="mt-6 pt-4 border-t border-toff-border/50">
                        <p className="text-[10px] font-bold text-toff-faint uppercase tracking-widest mb-2 px-2">Kurumsal</p>
                        {[
                            { label: 'Hakkımızda', to: '/hakkimizda' },
                            { label: 'Kurumsal Satış', to: '/kurumsal-satis' },
                            { label: 'Bize Sorun', to: '/bize-sorun' },
                            { label: 'SSS', to: '/sss' },
                        ].map(link => (
                            <Link key={link.to} to={link.to} className={navLinkClass + ' block mb-0.5'}>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-toff-border">
                    <p className="text-[11px] text-toff-faint italic">Endüstriyel Ruh, Doğal Dokunuş</p>
                </div>
            </div>
        </>
    );
}

export default OffCanvasSidebar;
