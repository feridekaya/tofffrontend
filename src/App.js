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
import AdminOrdersPage from './AdminOrdersPage';
import AdminOrderDetailPage from './AdminOrderDetailPage';
import CustomerOrderDetailPage from './CustomerOrderDetailPage';
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


  // Global sepete ekleme fonksiyonu
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

  // API'den Sepeti Çeken Fonksiyon
  const fetchCart = async (accessToken) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cart/`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      // Backend { items: [...] } dönüyor. Bizim state direkt array bekliyor.
      // Backend item yapısı: { id, product, quantity, selected_size, ... }
      // Frontend item yapısı: { cartId, product, quantity, selectedSize, ... }
      // Uyumlu hale getirelim:
      const mappedItems = (response.data.items || []).map(item => ({
        ...item,
        cartId: item.id, // Backend ID'sini cartId olarak kullan
        selectedSize: item.selected_size,
        selectedColor: item.selected_color
      }));
      setCart(mappedItems);
      console.log("Sepet yüklendi:", mappedItems);
    } catch (error) {
      console.error('Sepet yüklenirken hata:', error);
    }
  };

  // Global sepete ekleme fonksiyonu
  const handleAddToCart = async (productToAdd) => {
    // 1. KULLANICI GİRİŞ YAPMIŞSA -> BACKEND
    if (authTokens) {
      try {
        await axios.post(`${API_BASE_URL}/api/cart/add_item/`, {
          product_id: productToAdd.id,
          quantity: 1,
          selected_size_id: productToAdd.selectedSize ? productToAdd.selectedSize.id : null,
          selected_color_id: productToAdd.selectedColor ? productToAdd.selectedColor.id : null
        }, {
          headers: { 'Authorization': `Bearer ${authTokens.access}` }
        });
        // Ekleme başarılı, sepeti güncelle
        fetchCart(authTokens.access);
        alert("Ürün sepete eklendi!");
      } catch (error) {
        console.error("Sepete ekleme hatası:", error);
        alert("Ürün sepete eklenirken bir sorun oluştu.");
      }
      return;
    }

    // 2. MİSAFİR KULLANICI -> LOCAL STATE (Eski mantık)
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
      const finalPrice = productToAdd.selectedSize ? productToAdd.selectedSize.price : productToAdd.price;
      const productWithVariantPrice = {
        ...productToAdd,
        price: finalPrice
      };

      const newCartItem = {
        cartId: Date.now() + Math.random().toString(36).substr(2, 9),
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
    setAuthTokens(tokens);
    localStorage.setItem('authTokens', JSON.stringify(tokens));
    fetchFavorites(tokens.access);
    fetchCart(tokens.access); // Sepeti de çek
  };

  // Global çıkış yapma (logout) fonksiyonu
  const handleLogout = () => {
    setAuthTokens(null);
    localStorage.removeItem('authTokens');
    setFavorites([]);
    setCart([]); // Sepeti temizle
    console.log("Kullanıcı çıkış yaptı.");
  };

  // Sayfa yüklendiğinde hafızadaki jetonu (token) kontrol et
  useEffect(() => {
    const storedTokens = localStorage.getItem('authTokens');
    if (storedTokens) {
      const tokens = JSON.parse(storedTokens);
      setAuthTokens(tokens);
      fetchFavorites(tokens.access);
      fetchCart(tokens.access); // Sepeti de çek
    }
  }, []);


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
        await axios.post(`${API_BASE_URL}/api/favorites/`,
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
            element={<CartPage cart={cart} setCart={setCart} authTokens={authTokens} />}
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
          <Route path="/hesabim/siparisler/:id" element={<CustomerOrderDetailPage authTokens={authTokens} />} />

          {/* Rota 6: Favoriler Sayfası (DÜZELTME: 'onAddToCart' -> 'handleAddToCart') */}
          <Route
            path="/favoriler"
            element={<FavoritesPage
              favorites={favorites}
              onAddToCart={handleAddToCart} // <-- HATA BURADAYDI
              toggleFavorite={toggleFavorite}
            />}
          />

          {/* Rota 7: Sepet Sayfası (DUPLICATE REMOVED) */}


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

          {/* ADMIN ROUTES */}
          <Route path="/admin/orders" element={<AdminOrdersPage authTokens={authTokens} />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetailPage authTokens={authTokens} />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
} // <-- function App() BURADA BİTER (Fazladan '}' yok)

export default App;
