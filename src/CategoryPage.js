// frontend/src/CategoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css'; 
import ProductCard from './ProductCard'; 

function CategoryPage({ onAddToCart, favorites, toggleFavorite }) {
  const { slug } = useParams();
  
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState(''); 

  useEffect(() => {
    // 'slug' her değiştiğinde yeniden çalış
    
    // 1. Ürünleri çek
    axios.get(`http://127.0.0.1:8000/api/products/?category_slug=${slug}`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error(`'${slug}' için ürünler çekilirken hata oluştu!`, error);
        setProducts([]); 
      });

    // 2. Başlığı slug'dan oluştur
    const title = slug.replace(/-/g, ' ').toUpperCase();
    setCategoryName(title);

  }, [slug]); // 'slug' değiştikçe bu effect yeniden çalışır

  return (
    <header className="App-header">
      <h1>{categoryName}</h1>
      
      {products.length === 0 ? (
        <p>Bu kategoride henüz ürün bulunmamaktadır.</p>
      ) : (
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
      )}
    </header>
  );
}

export default CategoryPage;
// <-- FAZLADAN '}' PARANTEZİ SİLİNDİ