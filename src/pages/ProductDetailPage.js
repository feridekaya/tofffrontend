// frontend/src/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaRuler, FaWeightHanging, FaLayerGroup } from 'react-icons/fa';
import './ProductDetailPage.css';
import API_BASE_URL from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function ProductDetailPage() {
  const { handleAddToCart: onAddToCart, favorites, toggleFavorite } = useCart();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products/?slug=${slug}`)
      .then(response => {
        const products = response.data.results || response.data;
        if (products.length > 0) {
          const prod = products[0];
          setProduct(prod);
          setCurrentPrice(prod.discount_price || prod.price);
          setSelectedImage(prod.images?.length > 0 ? prod.images[0].image : prod.image);
        }
      })
      .catch(err => console.error('Ürün çekilirken hata:', err));
  }, [slug]);

  useEffect(() => {
    if (selectedSize) setCurrentPrice(selectedSize.price);
    else if (product) setCurrentPrice(product.discount_price || product.price);
  }, [selectedSize, product]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2)' });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
  };

  const handleAddToCartClick = () => {
    setErrorMsg('');
    if (product.sizes?.length > 0 && !selectedSize) {
      setErrorMsg('Lütfen bir boyut seçiniz.');
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      setErrorMsg('Lütfen bir renk seçiniz.');
      return;
    }
    onAddToCart({ ...product, price: currentPrice, selectedSize, selectedColor });
    showToast('✓ Sepete eklendi');
  };

  if (!product) return (
    <div className="detail-loading">
      <div className="detail-skeleton-img" />
      <div className="detail-skeleton-info">
        <div className="skeleton-line lg" />
        <div className="skeleton-line md" />
        <div className="skeleton-line sm" />
      </div>
    </div>
  );

  const isFavorited = (favorites || []).some(fav => fav.product.id === product.id);
  const hasDiscount = product.discount_price && parseFloat(product.discount_price) < parseFloat(product.price);
  const discountPct = hasDiscount
    ? Math.round((1 - parseFloat(product.discount_price) / parseFloat(product.price)) * 100)
    : 0;

  const allImages = [];
  if (product.image) allImages.push({ id: 'main', image: product.image });
  if (product.images) allImages.push(...product.images);

  return (
    <div className="product-detail-container">

      {/* Toast */}
      {toast && <div className="detail-toast">{toast}</div>}

      {/* SOL: Galeri */}
      <div className="gallery-section">
        <div className="main-image-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <img
            src={selectedImage || product.image}
            alt={product.name}
            className="main-image"
            style={zoomStyle}
          />
          {hasDiscount && (
            <span className="discount-badge">-%{discountPct}</span>
          )}
        </div>

        <div className="thumbnail-list">
          {allImages.map((img, index) => (
            <img
              key={img.id || index}
              src={img.image}
              alt={`Görsel ${index + 1}`}
              className={`thumbnail ${selectedImage === img.image ? 'active' : ''}`}
              onClick={() => setSelectedImage(img.image)}
            />
          ))}
        </div>
      </div>

      {/* SAĞ: Bilgi */}
      <div className="info-section">
        <div className="product-breadcrumb">
          {product.category_name && <span>{product.category_name}</span>}
        </div>

        <h1 className="product-title">{product.name}</h1>

        {/* Fiyat */}
        <div className="price-block">
          {hasDiscount ? (
            <>
              <span className="price-original">{parseFloat(product.price).toLocaleString('tr-TR')} TL</span>
              <span className="price-discounted">{parseFloat(currentPrice).toLocaleString('tr-TR')} TL</span>
            </>
          ) : (
            <span className="product-price">{parseFloat(currentPrice).toLocaleString('tr-TR')} TL</span>
          )}
        </div>

        <div className="product-description">
          <p>{product.description || 'Bu ürün için açıklama bulunmamaktadır.'}</p>
        </div>

        {/* Boyut Seçimi */}
        {product.sizes?.length > 0 && (
          <div className="variant-group">
            <span className="variant-title">Boyut: {selectedSize ? selectedSize.name : 'Seçiniz'}</span>
            <div className="variant-options">
              {product.sizes.map(size => (
                <div
                  key={size.id}
                  className={`size-option ${selectedSize?.id === size.id ? 'active' : ''}`}
                  onClick={() => { setSelectedSize(size); setErrorMsg(''); }}
                >
                  {size.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Renk Seçimi */}
        {product.colors?.length > 0 && (
          <div className="variant-group">
            <span className="variant-title">Renk: {selectedColor ? selectedColor.name : 'Seçiniz'}</span>
            <div className="variant-options">
              {product.colors.map((color, index) => (
                <div
                  key={color.id}
                  className={`color-option ${selectedColor?.id === color.id ? 'active' : ''}`}
                  style={{ backgroundColor: color.hex_code }}
                  onClick={() => {
                    setSelectedColor(color);
                    setErrorMsg('');
                    if (allImages.length > index) setSelectedImage(allImages[index].image);
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Hata Mesajı */}
        {errorMsg && <div className="variant-error">{errorMsg}</div>}

        {/* Aksiyonlar */}
        <div className="detail-actions">
          <button className="add-to-cart-btn-large" onClick={handleAddToCartClick}>
            Sepete Ekle
          </button>
          <button className="favorite-btn-large" onClick={() => toggleFavorite(product.id)}>
            {isFavorited ? <FaHeart className="filled-heart" /> : <FaRegHeart className="empty-heart" />}
          </button>
        </div>

        {/* Ürün Özellikleri Tablosu */}
        {(product.material || product.dimensions || product.weight) && (
          <div className="product-specs">
            <h3 className="specs-title">Ürün Özellikleri</h3>
            <div className="specs-table">
              {product.material && (
                <div className="spec-row">
                  <span className="spec-icon"><FaLayerGroup /></span>
                  <span className="spec-label">Malzeme</span>
                  <span className="spec-value">{product.material}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="spec-row">
                  <span className="spec-icon"><FaRuler /></span>
                  <span className="spec-label">Boyutlar</span>
                  <span className="spec-value">{product.dimensions}</span>
                </div>
              )}
              {product.weight && (
                <div className="spec-row">
                  <span className="spec-icon"><FaWeightHanging /></span>
                  <span className="spec-label">Ağırlık</span>
                  <span className="spec-value">{product.weight} kg</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductDetailPage;
