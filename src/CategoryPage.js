// frontend/src/CategoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // <-- React Router'dan "parametreleri" almak için
import axios from 'axios';
import './App.css'; 
import ProductCard from './ProductCard'; // <-- YENİ ProductCard bileşenimizi kullanıyoruz

function CategoryPage({ onAddToCart, favorites, toggleFavorite  }) {
  // useParams() hook'u, App.js'deki Route path'inden URL'deki 
  // değişkeni (biz 'slug' diyeceğiz) yakalamamızı sağlar.
  // Örn: /masalar tıklandığında { slug: 'masalar' } olur.
  const { slug } = useParams();
  
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState(''); // Başlığı da dinamik hale getirelim

  useEffect(() => {
    // useEffect, 'slug' her değiştiğinde (yani kullanıcı 
    // başka bir kategoriye tıkladığında) yeniden çalışacak.
    
    // 1. Ürünleri çekmek için 'slug'ı dinamik olarak kullan
    axios.get(`http://127.0.0.1:8000/api/products/?category_slug=${slug}`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error(`'${slug}' için ürünler çekilirken hata oluştu!`, error);
        setProducts([]); // Hata olursa listeyi boşalt
      });

    // 2. Kategori adını slug'dan alıp başlıkta kullanalım
    // "oturma-elemanlari" slug'ını "OTURMA ELEMANLARI" başlığına çevirir
    const title = slug.replace(/-/g, ' ').toUpperCase();
    setCategoryName(title);

  }, [slug]); // <-- Bağımlılık dizisi: 'slug' değiştiğinde bu effect yeniden çalışır

  // Bu JSX, AnaSayfa.js'dekiyle neredeyse aynı
  return (
    <header className="App-header">
      <h1>{categoryName}</h1> {/* Başlık artık dinamik! */}
      
      {products.length === 0 ? (
        <p>Bu kategoride henüz ürün bulunmamaktadır.</p>
      ) : (
        <div className="product-list"> 
          {/* AnaSayfa.js'de olduğu gibi ProductCard'ı kullanıyoruz */}
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