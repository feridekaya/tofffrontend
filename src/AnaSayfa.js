// frontend/src/AnaSayfa.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
import ProductCard from './ProductCard'; 

function AnaSayfa({ onAddToCart, favorites, toggleFavorite }) {
  
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Veri çekerken bir hata oluştu!', error);
      });
  }, []); 

  return (
    <header className="App-header"> 
      <h1>Ürün Listesi</h1>
      
      <div className="product-list"> 
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
    </header>
  );
}

export default AnaSayfa;
// <-- FAZLADAN '}' PARANTEZİ SİLİNDİ