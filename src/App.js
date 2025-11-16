import React, { useState,useEffect } from 'react'; // 
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

  // 1. Global sepet state'i
  const [cart, setCart] = useState([]);

  // 2. Global giriş (auth) state'i (EKSİK OLAN SATIR BUYDU)
  const [authTokens, setAuthTokens] = useState(null);
  const [favorites, setFavorites] = useState([]);
  // --- FONKSİYON BÖLÜMÜ ---
  // YENİ BLOK: Sayfa yüklendiğinde çalışır
  useEffect(() => {
  const storedTokens = localStorage.getItem('authTokens');

  if (storedTokens) {
    const tokens = JSON.parse(storedTokens); 

    setAuthTokens(tokens);

    fetchFavorites(tokens.access); 
  }
}, []);

  // 1. Global sepete ekleme fonksiyonu
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

  // 2. Global giriş başarılı fonksiyonu 
  // (HATALI YER: Burası 'handleAddToCart'in DIŞINDA olmalı)
  const handleLoginSuccess = (tokens) => {
    setAuthTokens(tokens); // Jetonları global state'e kaydet
    localStorage.setItem('authTokens', JSON.stringify(tokens));
    fetchFavorites(tokens.access);
  };
  // YENİ ÇIKIŞ YAPMA (LOGOUT) FONKSİYONU
  const handleLogout = () => {
    setAuthTokens(null); // 1. Global state'i (hafızayı) temizle
    localStorage.removeItem('authTokens'); // 2. Tarayıcı hafızasını temizle
    // (Kullanıcıyı ana sayfaya veya login'e yönlendirebiliriz,
    // ama Header'ın değişmesi yeterli olacaktır)
    setFavorites([]);
    console.log("Kullanıcı çıkış yaptı.");
  };
  // API'den favorileri çeken fonksiyon
  const fetchFavorites = async (accessToken) => {
    try {
      // Jetonu (token) kullanarak korumalı API'ye istek at
      const response = await axios.get('http://127.0.0.1:8000/api/favorites/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setFavorites(response.data); // Gelen favori listesini state'e kaydet
      console.log("Favoriler yüklendi:", response.data);
    } catch (error) {
      console.error('Favoriler çekilirken hata oluştu:', error);
      // TODO: Jeton süresi dolmuşsa (401 hatası) 'refresh token' kullan
    }
  };

  // Bir ürünü favori Ekleme/Çıkarma fonksiyonu
  const toggleFavorite = async (productId) => {
    if (!authTokens) {
      // Eğer giriş yapılmamışsa, hiçbir şey yapma
      // (veya kullanıcıyı /login'e yönlendir)
      console.log("Favori eklemek için giriş yapmalısınız.");
      return; 
    }

    // 1. Bu ürün zaten favorilerde mi diye kontrol et
    const existingFavorite = favorites.find(fav => fav.product === productId);
    const accessToken = authTokens.access;

    try {
      if (existingFavorite) {
        // 2. EĞER VARSA (Çıkar): DELETE isteği at
        await axios.delete(`http://127.0.0.1:8000/api/favorites/${existingFavorite.id}/`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        // State'den (hafızadan) çıkar
        setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== existingFavorite.id));
        console.log("Favorilerden çıkarıldı.");
      } else {
        // 3. EĞER YOKSA (Ekle): POST isteği at
        const response = await axios.post('http://127.0.0.1:8000/api/favorites/', 
          { product: productId }, // Body: Hangi ürünü ekleyeceğimiz
          { headers: { 'Authorization': `Bearer ${accessToken}` } }
        );
        // State'e (hafızaya) ekle
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
        {/* Header'a cart state'ini gönderiyoruz */}
       <Header 
          cart={cart} 
          authTokens={authTokens} // <-- 1. Jeton bilgisini gönder
          onLogout={handleLogout}  // <-- 2. Çıkış yapma fonksiyonunu gönder
        />
        
        <Routes>
          {/* Rota 1: Ana Sayfa */}
          <Route 
            path="/" 
            element={<AnaSayfa onAddToCart={handleAddToCart} />} 
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
         {/* YENİ ROTA: HESABIM SAYFASI */}
          <Route path="/hesabim" element={<AccountPage />} />
         <Route 
            path="/favoriler" 
            element={<FavoritesPage 
              favorites={favorites} 
              onAddToCart={handleAddToCart}
              toggleFavorite={toggleFavorite} 
            />} 
          /> 
         <Route 
            path="/:slug" 
            element={<CategoryPage 
              onAddToCart={handleAddToCart} 
              favorites={favorites} // <-- YENİ PROP
              toggleFavorite={toggleFavorite} // <-- YENİ PROP
            />} 
          />
         <Route 
            path="/:parentSlug/:slug" 
            element={<CategoryPage 
              onAddToCart={handleAddToCart} 
              favorites={favorites} // <-- YENİ PROP
              toggleFavorite={toggleFavorite} // <-- YENİ PROP
            />} 
          />
        
         <Route 
            path="/urun/:slug" 
            element={<ProductDetailPage 
              onAddToCart={handleAddToCart} 
              favorites={favorites} // <-- YENİ PROP
              toggleFavorite={toggleFavorite} // <-- YENİ PROP
            />} 
          />
         </Routes>

        <Footer /> 
      </div>
    </BrowserRouter>
  );

} // <-- function App() BURADA BİTER

export default App; // <-- 'export' en dış seviyede olmalı