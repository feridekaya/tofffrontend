// frontend/src/pages/FavoritesPage.js
import React from 'react';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function FavoritesPage() {
  const { favorites, handleAddToCart: onAddToCart, toggleFavorite } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-fade-up">
      <h1 className="text-2xl font-bold text-toff-text tracking-wider mb-8">FAVORİLERİM</h1>

      {!favorites || favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <FaHeart size={48} className="text-toff-faint" />
          <p className="text-toff-muted">Henüz favori ürününüz bulunmamaktadır.</p>
          <Link
            to="/"
            className="border border-toff-accent text-toff-accent hover:bg-toff-accent hover:text-white px-8 py-3 text-sm font-bold tracking-widest transition-colors rounded-lg"
          >
            ALIŞVERİŞE BAŞLA
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {favorites.map(item => (
            <ProductCard
              key={item.product.id}
              product={item.product}
              onAddToCart={onAddToCart}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
