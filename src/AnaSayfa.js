// frontend/src/AnaSayfa.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
import ProductCard from './ProductCard'; // <-- YENİ BİLEŞENİMİZİ İMPORT ETTİK

function AnaSayfa({ onAddToCart, favorites, toggleFavorite }) {
  
  const [products, setProducts] = useState([]);
  


  useEffect(() => {
    // Sadece tüm ürünleri çeken ana API'yi çağırıyoruz
    axios.get('http://127.0.0.1:8000/api/products/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Veri çekerken bir hata oluştu!', error);
      });
  }, []); 



  // AnaSayfa.js'in return'ü artık çok daha temiz!
  return (
    <header className="App-header"> 
      <h1>Ürün Listesi</h1>
      
      <div className="product-list"> 
        {/* ESKİ UZUN JSX'İN YERİNE BURASI GELDİ */}
        {products.map(product => (
          <ProductCard 
            key={product.id}        // React'in listeyi takip etmesi için
            product={product}       // Kartın içine ürün verisini gönder
            onAddToCart={onAddToCart} // Karta, 'tıklandığında' bu fonksiyonu çalıştır de
            favorites={favorites} // <-- YENİ PROP'U İLET
            toggleFavorite={toggleFavorite} // <-- YENİ PROP'U İLET
          />
        ))}
      </div>
    </header>
  );
}

export default AnaSayfa;