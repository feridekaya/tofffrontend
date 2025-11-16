// frontend/src/ProductCard.js
import React from 'react';
import './ProductCard.css'; 
import { Link } from 'react-router-dom';  
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function ProductCard({ product, onAddToCart, favorites, toggleFavorite }) {

  const imageUrl = product.image ? product.image : null; 
  const isFavorited = (favorites || []).some(fav => fav.product === product.id);

  return (
    <div className="product-card"> 
      
      {/* 2. KARTIN ÜST KISMINI LİNK İLE SARMALA */}
      <Link to={`/urun/${product.slug}`} className="product-card-link">
      
        <div className="product-image-container">
        
          <button 
              className="favorite-btn" 
              // App.js'deki global toggleFavorite fonksiyonunu çağır
              onClick={() => toggleFavorite(product.id)}
              onClick={(e) => {
                  e.stopPropagation(); // Tıklamanın arkadaki <Link>'e gitmesini engelle
                  toggleFavorite(product.id); // Şimdi favori fonksiyonunu çağır
              }}
          >
          
              {isFavorited ? (
                <FaHeart className="filled-heart" /> // Dolu (Kırmızı)
              ) : (
                <FaRegHeart className="empty-heart" /> // Boş (Beyaz/Gri)
              )}
           </button>  
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="product-image" />
          ) : (
            <div className="product-image-placeholder"></div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">{product.price} TL</p>
        </div>
      </Link>
      {/* LİNK SARMALAYICI BURADA BİTER */}

      {/* "Sepete Ekle" düğmesi LİNKİN DIŞINDA kalır */}
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