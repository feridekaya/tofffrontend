import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { FaTimes } from 'react-icons/fa';

function OffCanvasSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [collections, setCollections] = useState([]);
    const location = useLocation();

    useEffect(() => { setIsOpen(false); }, [location]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/collections/`)
            .then(r => setCollections(r.data))
            .catch(e => console.error('Koleksiyonlar yüklenemedi:', e));
    }, []);

    const mainCategories = [
        { name: 'Tüm Ürünler', slug: 'tum-urunler' },
        { name: 'Koleksiyonlar', slug: 'koleksiyonlar' },
        { name: 'Masalar', slug: 'masalar' },
        { name: 'Sehpalar', slug: 'sehpalar' },
        { name: 'Oturma Elemanları', slug: 'oturma-elemanlari' },
        { name: 'Kitaplıklar & Raflar', slug: 'kitapliklar-raflar' },
        { name: 'Aksesuarlar', slug: 'aksesuarlar' },
    ];

    const footerLinks = [
        { name: 'Kurumsal Satış', path: '/kurumsal-satis' },
        { name: 'Hakkımızda', path: '/hakkimizda' },
        { name: 'İletişim', path: '/bize-sorun' },
        { name: 'SSS', path: '/sss' },
    ];

    return (
        <>
            {/* Hamburger Button */}
            <button
                aria-label="Menüyü Aç"
                onClick={() => setIsOpen(true)}
                className="flex flex-col gap-1.5 p-2 group"
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

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-72 bg-toff-bg-2 border-r border-toff-border z-50 flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-toff-border">
                    <Link to="/" className="text-lg font-black tracking-[0.3em] text-toff-accent">TOFF</Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-toff-muted hover:text-toff-text transition-colors p-1"
                        aria-label="Menüyü Kapat"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6">

                    <div>
                        <p className="text-[10px] font-bold text-toff-faint uppercase tracking-widest mb-3 px-2">Kategoriler</p>
                        <div className="flex flex-col gap-0.5">
                            {mainCategories.map(cat => (
                                <Link
                                    key={cat.slug}
                                    to={`/${cat.slug}`}
                                    className="px-3 py-2.5 text-sm font-medium text-toff-muted hover:text-toff-accent hover:bg-toff-bg-3 rounded-lg transition-colors"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {collections.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-toff-faint uppercase tracking-widest mb-3 px-2">Koleksiyonlar</p>
                            <div className="flex flex-col gap-0.5">
                                {collections.map(col => (
                                    <Link
                                        key={col.id}
                                        to={`/koleksiyon/${col.slug}`}
                                        className="px-3 py-2.5 text-sm text-toff-muted hover:text-toff-accent hover:bg-toff-bg-3 rounded-lg transition-colors"
                                    >
                                        {col.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-[10px] font-bold text-toff-faint uppercase tracking-widest mb-3 px-2">Kurumsal</p>
                        <div className="flex flex-col gap-0.5">
                            {footerLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="px-3 py-2.5 text-sm text-toff-muted hover:text-toff-accent hover:bg-toff-bg-3 rounded-lg transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Footer tagline */}
                <div className="px-5 py-4 border-t border-toff-border">
                    <p className="text-[11px] text-toff-faint italic">Endüstriyel Ruh, Doğal Dokunuş</p>
                </div>
            </div>
        </>
    );
}

export default OffCanvasSidebar;
