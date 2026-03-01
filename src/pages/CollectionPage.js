// frontend/src/pages/CollectionPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import API_BASE_URL from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function CollectionPage() {
    const { handleAddToCart: onAddToCart, favorites, toggleFavorite } = useCart();
    const { slug } = useParams();
    const [collection, setCollection] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/api/collections/${slug}/`)
            .then(res => setCollection(res.data))
            .catch(err => console.error('Koleksiyon bilgisi alınamadı:', err));

        axios.get(`${API_BASE_URL}/api/collections/${slug}/products/?page=${currentPage}`)
            .then(res => {
                setProducts(res.data.results || res.data);
                if (res.data.count) setTotalPages(Math.ceil(res.data.count / 24));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [slug, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-toff-bg">

            {/* Banner */}
            <div className="relative h-64 sm:h-80 overflow-hidden">
                <img
                    src={`/assets/collection-${slug}.png`}
                    alt={collection?.name || 'Koleksiyon'}
                    className="w-full h-full object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-toff-bg via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-4 text-center">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-[0.2em] text-white drop-shadow-lg mb-2">
                        {collection?.name || 'Koleksiyon'}
                    </h1>
                    {collection?.description && (
                        <p className="text-sm text-white/70 max-w-md">{collection.description}</p>
                    )}
                </div>
            </div>

            {/* Ürünler */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                {loading ? (
                    <div className="flex items-center justify-center h-48 text-toff-muted gap-3">
                        <div className="w-8 h-8 border-2 border-toff-border border-t-toff-accent rounded-full animate-spin" />
                        Yükleniyor...
                    </div>
                ) : products.length === 0 ? (
                    <p className="text-center text-toff-muted py-16">Bu koleksiyonda henüz ürün bulunmamaktadır.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
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
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="px-4 py-2 border border-toff-border text-toff-muted hover:border-toff-accent hover:text-toff-accent rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    ‹ Önceki
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-toff-accent text-white' : 'border border-toff-border text-toff-muted hover:border-toff-accent hover:text-toff-accent'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="px-4 py-2 border border-toff-border text-toff-muted hover:border-toff-accent hover:text-toff-accent rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Sonraki ›
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default CollectionPage;
