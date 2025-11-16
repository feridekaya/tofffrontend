import React, { useState,useEffect } from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css'; 

// --- Ana bileşenler ---
import Header from './Header';
import Footer from './Footer';

// --- Sayfa bileşenleri ---
import AnaSayfa from './AnaSayfa'; 
import CategoryPage from './CategoryPage.js'; 
import CartPage from './CartPage.js';
import RegisterPage from './RegisterPage.js';
import LoginPage from './LoginPage.js';
import ProductDetailPage from './ProductDetailPage.js';
import AccountPage from './AccountPage.js';
import FavoritesPage from './FavoritesPage.js'

function App() {
  
  // --- STATE (HAFIZA) BÖLÜMÜ ---
  const [cart, setCart] = useState([]);
  const [authTokens, setAuthTokens] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // --- FONKSİYON BÖLÜMÜ ---
  
  // Sayfa yüklendiğinde hafızadaki jetonu (token) kontrol et
  useEffect(() => {
    const storedTokens = localStorage.getItem('authTokens');
    if (storedTokens) {
      const tokens = JSON.parse(storedTokens); 
      setAuthTokens(tokens);
      fetchFavorites(tokens.access); 
    }
  }, []); // [] = Sadece bir kez çalışır

  // Global sepete ekleme fonksiyonu
  const handleAddToCart = (productToAdd) => {
    const existingProductIndex = cart.findIndex(
      item => item.product.id === productToAdd.id
    );

    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) => {
        if (index === existingProductIndex) {
          return { ...item, quantity: item.quantity + 1 }; 
        }
        return item;
      });
      setCart(updatedCart);
      console.log('Miktar artırıldı:', productToAdd.name);
      console.log('Tüm Sepet (Global):', updatedCart);
    } else {
      const newCartItem = { product: productToAdd, quantity: 1 };
      const updatedCart = [...cart, newCartItem];
      setCart(updatedCart);
      console.log('Sepete eklendi (Global):', productToAdd.name);
      console.log('Tüm Sepet (Global):', updatedCart);
    }
  }; // <-- handleAddToCart fonksiyonu BURADA BİTER

  // Global giriş başarılı fonksiyonu
  const handleLoginSuccess = (tokens) => {
    setAuthTokens(tokens); // Jetonları global state'e kaydet
    localStorage.setItem('authTokens', JSON.stringify(tokens));
    fetchFavorites(tokens.access); // Giriş yapınca favorileri çek
  };

  // Global çıkış yapma (logout) fonksiyonu
  const handleLogout = () => {
    setAuthTokens(null); // 1. Global state'i (hafızayı) temizle
    localStorage.removeItem('authTokens'); // 2. Tarayıcı hafızasını temizle
    setFavorites([]); // 3. Favori listesini temizle
    console.log("Kullanıcı çıkış yaptı.");
  };

  // API'den favorileri çeken fonksiyon
  const fetchFavorites = async (accessToken) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/favorites/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setFavorites(response.data); // Gelen favori listesini state'e kaydet
      console.log("Favoriler yüklendi:", response.data);
    } catch (error) {
      console.error('Favoriler çekilirken hata oluştu:', error);
    }
  };

  // Bir ürünü favori Ekleme/Çıkarma fonksiyonu
  const toggleFavorite = async (productId) => {
    if (!authTokens) {
      console.log("Favori eklemek için giriş yapmalısınız.");
      return; 
    }

    const existingFavorite = favorites.find(fav => fav.product.id === productId); // Düzeltme: fav.product.id olmalı
    const accessToken = authTokens.access;

    try {
      if (existingFavorite) {
        // Çıkar
        await axios.delete(`http://127.0.0.1:8000/api/favorites/${existingFavorite.id}/`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== existingFavorite.id));
        console.log("Favorilerden çıkarıldı.");
      } else {
        // Ekle
        const response = await axios.post('http://127.0.0.1:8000/api/favorites/', 
          { product: productId },
          { headers: { 'Authorization': `Bearer ${accessToken}` } }
        );
        setFavorites(prevFavorites => [...prevFavorites, response.data]);
        console.log("Favorilere eklendi.");
      }
    } catch (error) {
      console.error("Favori işlemi hatası:", error);
    }
  };

  // --- JSX (GÖRÜNÜM) BÖLÜMÜ ---
  return (
    <BrowserRouter>
      <div className="App">
        <Header 
          cart={cart} 
          authTokens={authTokens}
          onLogout={handleLogout}
        />
        
        <Routes>
          {/* Rota 1: Ana Sayfa */}
          <Route 
            path="/" 
            element={<AnaSayfa 
              onAddToCart={handleAddToCart} 
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />} 
          /> 
          
          {/* Rota 2: Sepet Sayfası */}
          <Route 
            path="/sepet" 
            element={<CartPage cart={cart} setCart={setCart} />} 
          />
          
          {/* Rota 3: Kayıt Ol Sayfası */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Rota 4: Giriş Yap Sayfası */}
          <Route 
            path="/login" 
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />} 
          />
         
          {/* Rota 5: Hesabım Sayfası */}
          <Route path="/hesabim" element={<AccountPage />} />
         
          {/* Rota 6: Favoriler Sayfası (DÜZELTME: 'onAddToCart' -> 'handleAddToCart') */}
          <Route 
            path="/favoriler" 
            element={<FavoritesPage 
              favorites={favorites} 
              onAddToCart={handleAddToCart} // <-- HATA BURADAYDI
              toggleFavorite={toggleFavorite} 
            />} 
          /> 
         
          {/* Rota 7: Kategori Sayfası (Dinamik) */}
          <Route 
            path="/:slug" 
            element={<CategoryPage 
              onAddToCart={handleAddToCart} 
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />} 
          />
          <Route 
            path="/:parentSlug/:slug" 
            element={<CategoryPage 
              onAddToCart={handleAddToCart} 
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />} 
          />
        
          {/* Rota 8: Ürün Detay Sayfası (Dinamik) */}
          <Route 
            path="/urun/:slug" 
            element={<ProductDetailPage 
              onAddToCart={handleAddToCart} 
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />} 
          />
        </Routes>

        <Footer /> 
      </div>
    </BrowserRouter>
  );
} // <-- function App() BURADA BİTER (Fazladan '}' yok)

export default App;