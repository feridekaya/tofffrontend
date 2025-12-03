import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './ProductDetailPage.css';
import API_BASE_URL from './config/api';

function ProductDetailPage({ onAddToCart, favorites, toggleFavorite }) {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);

  // State
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [errorMsg, setErrorMsg] = useState(''); // Hata mesajı için state

  // Zoom State
  const [zoomStyle, setZoomStyle] = useState({});

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products/?slug=${slug}`)
      .then(response => {
        const products = response.data.results || response.data;

        if (products.length > 0) {
          const prod = products[0];
          setProduct(prod);
          setCurrentPrice(prod.price);

          if (prod.images && prod.images.length > 0) {
            setSelectedImage(prod.images[0].image);
          } else {
            setSelectedImage(prod.image);
          }
        }
      })
      .catch(error => {
        console.error("Ürün çekilirken hata oluştu!", error);
      });
  }, [slug]);

  useEffect(() => {
    if (selectedSize) {
      setCurrentPrice(selectedSize.price);
    } else if (product) {
      setCurrentPrice(product.price);
    }
  }, [selectedSize, product]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  // Sepete Ekleme Doğrulama Fonksiyonu
  const handleAddToCartClick = () => {
    setErrorMsg(''); // Önceki hatayı temizle

    // 1. Boyut kontrolü
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setErrorMsg('Lütfen bir boyut seçiniz.');
      return;
    }

    // 2. Renk kontrolü
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setErrorMsg('Lütfen bir renk seçiniz.');
      return;
    }

    // Her şey tamamsa sepete ekle
    onAddToCart({
      ...product,
      price: currentPrice,
      selectedSize,
      selectedColor
    });
  };

  if (!product) return <div style={{ padding: '100px', textAlign: 'center' }}>Yükleniyor...</div>;

  const isFavorited = (favorites || []).some(fav => fav.product.id === product.id);

  const allImages = [];
  if (product.image) allImages.push({ id: 'main', image: product.image });
  if (product.images) allImages.push(...product.images);

  return (
    <div className="product-detail-container">

      {/* SOL: Galeri */}
      <div className="gallery-section">
        <div
          className="main-image-container"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={selectedImage || product.image}
            alt={product.name}
            className="main-image"
            style={zoomStyle}
          />
        </div>

        <div className="thumbnail-list">
          {allImages.map((img, index) => (
            <img
              key={img.id || index}
              src={img.image}
              alt={`Thumbnail ${index}`}
              className={`thumbnail ${selectedImage === img.image ? 'active' : ''}`}
              onClick={() => setSelectedImage(img.image)}
            />
          ))}
        </div>
      </div>

      {/* SAĞ: Bilgi */}
      <div className="info-section">
        <h1 className="product-title">{product.name}</h1>
        <div className="product-price">{currentPrice} TL</div>

        <div className="product-description">
          <p>{product.description || 'Bu ürün için açıklama bulunmamaktadır.'}</p>
        </div>

        {/* Boyut Seçimi */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="variant-group">
            <span className="variant-title">Boyut: {selectedSize ? selectedSize.name : 'Seçiniz'}</span>
            <div className="variant-options">
              {product.sizes.map(size => (
                <div
                  key={size.id}
                  className={`size-option ${selectedSize?.id === size.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedSize(size);
                    setErrorMsg(''); // Seçim yapılınca hatayı kaldır
                  }}
                >
                  {size.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Renk Seçimi */}
        {product.colors && product.colors.length > 0 && (
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
                    setErrorMsg(''); // Seçim yapılınca hatayı kaldır
                    if (allImages.length > index) {
                      setSelectedImage(allImages[index].image);
                    }
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Hata Mesajı */}
        {errorMsg && (
          <div style={{ color: '#e74c3c', marginBottom: '15px', fontWeight: 'bold' }}>
            {errorMsg}
          </div>
        )}

        {/* Aksiyonlar */}
        <div className="detail-actions">
          <button
            className="add-to-cart-btn-large"
            onClick={handleAddToCartClick}
          >
            Sepete Ekle
          </button>

          <button
            className="favorite-btn-large"
            onClick={() => toggleFavorite(product.id)}
          >
            {isFavorited ? <FaHeart className="filled-heart" /> : <FaRegHeart className="empty-heart" />}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductDetailPage;
