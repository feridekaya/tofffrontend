// frontend/src/FavoritesPage.js
import React from 'react';
import ProductCard from './ProductCard'; // Ürün kartı bileşenimiz
import './App.css'; // Ana stiller

// App.js'den 'favorites' listesini ve diğer fonksiyonları al
function FavoritesPage({ favorites, onAddToCart, toggleFavorite }) {
  
  return (
    <div className="App-header">
      <h1>Favorilerim</h1>
      
      {/* favorites dizisinin (App.js'den gelen) boş olup olmadığını kontrol et */}
      {!favorites || favorites.length === 0 ? (
        <p>Henüz favori ürününüz bulunmamaktadır.</p>
      ) : (
        <div className="product-list"> 
          {/* Backend'i (serializers.py) düzelttiğimiz için 
            'item.product' artık tam ürün objesidir.
          */}
          {favorites.map(item => (
            <ProductCard 
              key={item.product.id}
              product={item.product} // <-- 'item.product' objesini karta gönder
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
// <-- FAZLADAN '}' PARANTEZİ SİLİNDİ