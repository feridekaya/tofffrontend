import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CollectionsPage.css';
import API_BASE_URL from './config/api';

function CollectionsPage() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/collections/`)
            .then(response => {
                setCollections(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Koleksiyonlar yüklenemedi:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const banner = document.querySelector('.collections-banner-image');
            if (banner) {
                const scrolled = window.pageYOffset;
                banner.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) {
        return <div className="collections-page-container"><p>Yükleniyor...</p></div>;
    }

    return (
        <div className="collections-page-container">
            <header className="collections-header">
                <div className="collections-banner">
                    <img src="/assets/koleksiyonlar-header.png" alt="Koleksiyonlar" className="collections-banner-image" />
                    <div className="collections-banner-overlay">
                        <h1>KOLEKSİYONLAR</h1>
                    </div>
                </div>
            </header>

            <div className="collections-list">
                {collections.map(collection => (
                    <Link to={`/koleksiyon/${collection.slug}`} key={collection.id} className="collection-item">
                        <div
                            className="collection-banner"
                            style={{
                                backgroundImage: `url('${collection.image || `/assets/collection-${collection.slug}.png`}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <div className="collection-overlay">
                                <h2>{collection.name}</h2>
                                {collection.description && <p>{collection.description}</p>}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default CollectionsPage;

