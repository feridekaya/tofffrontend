// frontend/src/CollectionPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import './CategoryPage.css';
import API_BASE_URL from './config/api';

function CollectionPage({ onAddToCart, favorites, toggleFavorite }) {
    const { slug } = useParams();
    const [collection, setCollection] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // Koleksiyon bilgilerini al
        axios.get(`${API_BASE_URL}/api/collections/${slug}/`)
            .then(response => {
                setCollection(response.data);
            })
            .catch(error => {
                console.error('Koleksiyon bilgisi alınamadı:', error);
            });

        // Koleksiyonun ürünlerini al
        axios.get(`${API_BASE_URL}/api/collections/${slug}/products/?page=${currentPage}`)
            .then(response => {
                setProducts(response.data.results || response.data);
                if (response.data.count) {
                    setTotalPages(Math.ceil(response.data.count / 24));
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Ürünler alınamadı:', error);
                setLoading(false);
            });
    }, [slug, currentPage]);

    useEffect(() => {
        const handleScroll = () => {
            const banner = document.querySelector('.category-banner-image');
            if (banner) {
                const scrolled = window.pageYOffset;
                banner.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return <div className="category-page-container"><p>Yükleniyor...</p></div>;
    }

    return (
        <div className="category-page-container">
            <header className="category-header">
                <div className="category-banner">
                    <img src={`/assets/collection-${slug}.png`} alt={`${collection?.name} Header`} className="category-banner-image" />
                    <div className="category-banner-overlay">
                        <h1>{collection?.name || 'Koleksiyon'}</h1>
                        {collection?.description && (
                            <p className="collection-description">{collection.description}</p>
                        )}
                    </div>
                </div>
            </header>

            <div className="product-list">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                        favorites={favorites}
                        toggleFavorite={toggleFavorite}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="page-btn"
                    >
                        &lt; Önceki
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                    >
                        Sonraki &gt;
                    </button>
                </div>
            )}
        </div>
    );
}

export default CollectionPage;

