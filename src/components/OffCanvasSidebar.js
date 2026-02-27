import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './OffCanvasSidebar.css';
import API_BASE_URL from '../config/api';

function OffCanvasSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [collections, setCollections] = useState([]);
    const location = useLocation();

    // Close sidebar when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Fetch collections
    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/collections/`)
            .then(response => {
                setCollections(response.data);
            })
            .catch(error => {
                console.error('Koleksiyonlar yüklenemedi:', error);
            });
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
        { name: 'İletişim', path: '/iletisim' },
        { name: 'SSS', path: '/sss' },
    ];

    return (
        <>
            {/* Hamburger Button */}
            <button
                className={`hamburger-btn ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Backdrop Overlay */}
            {isOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Menu */}
            <div className={`sidebar-menu ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-logo">
                        TOFF
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    {/* Kategoriler */}
                    <div className="nav-section">
                        <h3 className="nav-section-title">Kategoriler</h3>
                        {mainCategories.map((category) => (
                            <Link
                                key={category.slug}
                                to={`/${category.slug}`}
                                className="nav-link"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>

                    {/* Dinamik Koleksiyonlar */}
                    {collections.length > 0 && (
                        <div className="nav-section">
                            <Link to="/koleksiyonlar" className="nav-section-title-link">
                                <h3 className="nav-section-title">Koleksiyonlar</h3>
                            </Link>
                            {collections.map((collection) => (
                                <Link
                                    key={collection.id}
                                    to={`/koleksiyon/${collection.slug}`}
                                    className="nav-link"
                                >
                                    {collection.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Kurumsal */}
                    <div className="nav-section">
                        <h3 className="nav-section-title">Kurumsal</h3>
                        {footerLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="nav-link"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <p className="sidebar-tagline">
                        Endüstriyel Ruh, Doğal Dokunuş
                    </p>
                </div>
            </div>
        </>
    );
}

export default OffCanvasSidebar;

