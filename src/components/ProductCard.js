// frontend/src/components/ProductCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function ProductCard({ product, onAddToCart, favorites, toggleFavorite }) {
  const [isHovered, setIsHovered] = useState(false);

  const mainImage = product.image;
  const hoverImage = product.images?.length > 0 ? product.images[0].image : mainImage;
  const displayImg = isHovered ? hoverImage : mainImage;

  const isFavorited = (favorites || []).some(fav => fav.product.id === product.id);

  return (
    <div className="group flex flex-col bg-toff-bg border border-toff-border hover:border-toff-accent/30 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">

      {/* Image */}
      <div
        className="relative overflow-hidden aspect-[4/3] bg-toff-bg-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Favori butonu */}
        <button
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm hover:bg-toff-accent/80 transition-all opacity-0 group-hover:opacity-100"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product.id); }}
          aria-label={isFavorited ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
        >
          {isFavorited
            ? <FaHeart size={13} className="text-red-400" />
            : <FaRegHeart size={13} className="text-white" />
          }
        </button>

        <Link to={`/urun/${product.slug}`} className="block w-full h-full">
          {displayImg ? (
            <img
              src={displayImg}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-toff-bg-3 flex items-center justify-center">
              <span className="text-toff-faint text-xs">Görsel yok</span>
            </div>
          )}
        </Link>
      </div>

      {/* Bilgiler */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <Link to={`/urun/${product.slug}`} className="group/name">
          <h3 className="text-sm font-semibold text-toff-text group-hover/name:text-toff-accent transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-auto pt-1">
          {product.discount_price ? (
            <>
              <span className="text-toff-accent font-bold text-base">
                {parseFloat(product.discount_price).toLocaleString('tr-TR')} ₺
              </span>
              <span className="text-toff-faint text-xs line-through">
                {parseFloat(product.price).toLocaleString('tr-TR')} ₺
              </span>
            </>
          ) : (
            <span className="text-toff-accent font-bold text-base">
              {parseFloat(product.price).toLocaleString('tr-TR')} ₺
            </span>
          )}
        </div>

        {/* Renk varyantları */}
        {product.colors?.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1">
            {product.colors.slice(0, 5).map(color => (
              <div
                key={color.id}
                className="w-4 h-4 rounded-full border border-white/20 cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color.hex_code }}
                title={color.name}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-toff-faint font-medium">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
      </div>

      {/* Sepete Ekle Butonu */}
      <button
        onClick={() => onAddToCart(product)}
        className="mx-4 mb-4 py-2 border border-toff-border-2 text-toff-muted text-xs font-bold tracking-widest rounded hover:border-toff-accent hover:text-toff-accent hover:bg-toff-accent/5 transition-all uppercase"
      >
        Sepete Ekle
      </button>

    </div>
  );
}

export default ProductCard;
