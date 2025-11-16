import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './ProductCard.css'; // Stil dosyasını import et

// Prop'ları yakala
function ProductDetailPage({ onAddToCart, favorites, toggleFavorite }) {
  const { slug } = useParams(); 
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/products/?slug=${slug}`)
      .then(response => {
        if (response.data.length > 0) {
          setProduct(response.data[0]);
        } 
      })
      .catch(error => {
        console.error("Ürün çekilirken hata oluştu!", error);
      });
  }, [slug]); 

  const imageUrl = product && product.image ? product.image : null;

  // DÜZELTME: 'fav.product' objesinin 'id'sine bakmalıyız
  const isFavorited = (favorites || []).some(fav => product && fav.product.id === product.id);

  if (!product) {
    return <div style={{padding: '100px', textAlign: 'center'}}>Yükleniyor...</div>;
  }

  return (
    <div className="product-detail-container" style={{maxWidth: '1000px', margin: '40px auto', padding: '20px'}}>
      <h1>{product.name}</h1>
      
      {imageUrl && (
        <img src={imageUrl} alt={product.name} style={{width: '100%', maxWidth: '500px'}} />
      )}
      
      <h2>{product.price} TL</h2>
      
      <div className="product-description">
        <p>{product.description || 'Bu ürün için henüz bir açıklama girilmemiştir.'}</p>
      </div>

      <div className="detail-page-actions" style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
        <button 
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product)}
        >
          Sepete Ekle
        </button>
        
        {/* Favori düğmesinin 'onClick' olayı düzeltildi */}
        <button 
          className="favorite-btn" 
          style={{position: 'static', width: 'auto', padding: '0 15px'}}
          onClick={(e) => {
            e.stopPropagation(); // Her ihtimale karşı
            toggleFavorite(product.id);
          }}
        >
          {isFavorited ? <FaHeart className="filled-heart" /> : <FaRegHeart className="empty-heart" />}
        </button>
      </div>

    </div>
  );
}

export default ProductDetailPage;
// <-- FAZLADAN '}' PARANTEZİ SİLİNDİ