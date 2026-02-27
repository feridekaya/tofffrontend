// frontend/src/ProductCard.js
import React, { useState } from 'react';
import './ProductCard.css';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function ProductCard({ product, onAddToCart, favorites, toggleFavorite }) {
  const [isHovered, setIsHovered] = useState(false);

  const mainImage = product.image;
  // Varsa ilk galeri resmini, yoksa ana resmi kullan
  const hoverImage = product.images && product.images.length > 0 ? product.images[0].image : mainImage;

  const displayImage = isHovered ? hoverImage : mainImage;

  const isFavorited = (favorites || []).some(fav => fav.product.id === product.id);

  return (
    <div className="product-card">

      <div
        className="product-image-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          className="favorite-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
        >
          {isFavorited ? (
            <FaHeart className="filled-heart" />
          ) : (
            <FaRegHeart className="empty-heart" />
          )}
        </button>

        <Link to={`/urun/${product.slug}`} className="product-card-link">
          {displayImage ? (
            <img src={displayImage} alt={product.name} className="product-image" />
          ) : (
            <div className="product-image-placeholder"></div>
          )}
        </Link>
      </div>

      <Link to={`/urun/${product.slug}`} className="product-card-link">
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">{product.price} TL</p>

          {/* Renk Seçenekleri Göstergesi */}
          {product.colors && product.colors.length > 0 && (
            <div className="product-card-colors">
              {product.colors.slice(0, 5).map(color => (
                <div
                  key={color.id}
                  className="color-dot"
                  style={{ backgroundColor: color.hex_code }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 5 && <span className="more-colors">+{product.colors.length - 5}</span>}
            </div>
          )}
        </div>
      </Link>

      <button
        className="add-to-cart-btn"
        onClick={() => onAddToCart(product)}
      >
        Sepete Ekle
      </button>

    </div>
  );
}

export default ProductCard;

