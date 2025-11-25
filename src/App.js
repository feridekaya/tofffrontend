import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import ScrollToTop from './ScrollToTop';
import OffCanvasSidebar from './OffCanvasSidebar';
import API_BASE_URL from './config/api';

// --- Ana bileşenler ---
import Header from './Header';
import Footer from './Footer';

// --- Sayfa bileşenleri ---
import AnaSayfa from './AnaSayfa';
import CategoryPage from './CategoryPage.js';
import CollectionPage from './CollectionPage.js';
import CollectionsPage from './CollectionsPage.js';
import CartPage from './CartPage.js';
import RegisterPage from './RegisterPage.js';
import LoginPage from './LoginPage.js';
import ProductDetailPage from './ProductDetailPage.js';
import AccountPage from './AccountPage.js';
import FavoritesPage from './FavoritesPage.js';
import CheckoutPage from './CheckoutPage.js';

// --- Footer sayfaları ---
import AboutPage from './AboutPage';
import CorporateSalesPage from './CorporateSalesPage';
import InfoSocietyPage from './InfoSocietyPage';
import ToffPromisePage from './ToffPromisePage';
import ContactPage from './ContactPage';
import FAQPage from './FAQPage';
import ShippingReturnPage from './ShippingReturnPage';
import MembershipAgreementPage from './MembershipAgreementPage';

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
  // Global sepete ekleme fonksiyonu
  const handleAddToCart = (productToAdd) => {
    // Sepette bu ürün (ID + Size + Color kombinasyonu) var mı?
    const existingProductIndex = cart.findIndex(item => {
      const isSameId = item.product.id === productToAdd.id;
      const isSameSize = JSON.stringify(item.selectedSize) === JSON.stringify(productToAdd.selectedSize);
      const isSameColor = JSON.stringify(item.selectedColor) === JSON.stringify(productToAdd.selectedColor);
      return isSameId && isSameSize && isSameColor;
    });

    if (existingProductIndex !== -1) {
      // Varsa miktarını artır
      const updatedCart = cart.map((item, index) => {
        if (index === existingProductIndex) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCart(updatedCart);
      console.log('Miktar artırıldı:', productToAdd.name);
    } else {
      // Yoksa yeni kalem olarak ekle
      // Fiyatı doğru kaydettiğimizden emin olalım (seçili boyut fiyatı veya normal fiyat)
      const finalPrice = productToAdd.selectedSize ? productToAdd.selectedSize.price : productToAdd.price;

      // Ürün objesini sepete uygun hale getir (fiyatı güncelle)
      const productWithVariantPrice = {
        ...productToAdd,
        price: finalPrice // Sepette görünecek fiyat
      };

      const newCartItem = {
        cartId: Date.now() + Math.random().toString(36).substr(2, 9), // Benzersiz ID oluştur
        product: productWithVariantPrice,
        quantity: 1,
        selectedSize: productToAdd.selectedSize,
        selectedColor: productToAdd.selectedColor
      };

      const updatedCart = [...cart, newCartItem];
      setCart(updatedCart);
      console.log('Sepete eklendi (Global):', productToAdd.name);
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
      const response = await axios.get(`${API_BASE_URL}/api/favorites/`, {
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
      alert("Favori eklemek için giriş yapmalısınız.");
      return;
    }

    // Backend'den gelen veri yapısına göre kontrol et
    // FavoriteReadSerializer kullanıldığı için 'product' bir obje olarak geliyor
    const existingFavorite = favorites.find(fav => fav.product.id === productId);
    const accessToken = authTokens.access;

    try {
      if (existingFavorite) {
        // Çıkar
        await axios.delete(`${API_BASE_URL}/api/favorites/${existingFavorite.id}/`, {
          headers: { 'Authorization': `Bearer ${authTokens.access}` }
        });

        // State'den çıkar
        setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== existingFavorite.id));
        console.log("Favorilerden çıkarıldı.");
      } else {
        // Ekle
        const response = await axios.post(`${API_BASE_URL}/api/favorites/`,
          { product: productId }, // FavoriteWriteSerializer sadece ID bekler
          { headers: { 'Authorization': `Bearer ${authTokens.access}` } }
        );

        // Backend 'FavoriteWriteSerializer' kullandığı için dönen cevapta 'product' sadece ID olabilir.
        // Ancak biz state'imizde 'FavoriteReadSerializer' yapısını (product obje olarak) tutuyoruz.
        // Bu yüzden state'i güncellerken dikkatli olmalıyız veya sayfayı yenilemeliyiz.
        // En temiz yöntem: Ekleme sonrası favorileri tekrar çekmek.
        fetchFavorites(accessToken);
        console.log("Favorilere eklendi.");
      }
    } catch (error) {
      console.error("Favori işlemi hatası:", error.response?.data || error);
      alert("İşlem sırasında bir hata oluştu.");
    }
  };



  // --- JSX (GÖRÜNÜM) BÖLÜMÜ ---
  return (
    <BrowserRouter>
      <div className="App">
        <ScrollToTop />
        <OffCanvasSidebar />
        <Routes>
          <Route path="/" element={null} />
          <Route path="*" element={
            <Header
              cart={cart}
              authTokens={authTokens}
              onLogout={handleLogout}
            />
          } />
        </Routes>

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

          {/* Rota 3.5: Koleksiyon Sayfası */}
          <Route path="/koleksiyonlar" element={<CollectionsPage />} />
          <Route
            path="/koleksiyon/:slug"
            element={
              <CollectionPage
                onAddToCart={handleAddToCart}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            }
          />

          {/* Rota 4: Giriş Yap Sayfası */}
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Rota 5: Hesabım Sayfası */}
          <Route
            path="/hesabim"
            element={<AccountPage
              authTokens={authTokens}
              onLogout={handleLogout} // <-- Çıkış yap fonksiyonunu prop olarak ekledik
            />}
          />

          {/* Rota 6: Favoriler Sayfası (DÜZELTME: 'onAddToCart' -> 'handleAddToCart') */}
          <Route
            path="/favoriler"
            element={<FavoritesPage
              favorites={favorites}
              onAddToCart={handleAddToCart} // <-- HATA BURADAYDI
              toggleFavorite={toggleFavorite}
            />}
          />

          {/* Rota 7: Sepet Sayfası */}
          <Route
            path="/sepet"
            element={<CartPage
              cart={cart}
              setCart={setCart}
            />}
          />

          {/* Rota 8: Ödeme Sayfası */}
          <Route
            path="/odeme"
            element={<CheckoutPage
              cart={cart}
              setCart={setCart}
              authTokens={authTokens}
            />}
          />

          {/* Footer Sayfaları */}
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/kurumsal-satis" element={<CorporateSalesPage />} />
          <Route path="/bilgi-toplumu-hizmetleri" element={<InfoSocietyPage />} />
          <Route path="/toff-promise" element={<ToffPromisePage />} />
          <Route path="/bize-sorun" element={<ContactPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/sss" element={<FAQPage />} />
          <Route path="/kargo-iade" element={<ShippingReturnPage />} />
          <Route path="/uyelik-sozlesmesi" element={<MembershipAgreementPage />} />

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