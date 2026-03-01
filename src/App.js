// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// === Context ===
import { UIProvider } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useAuth } from './context/AuthContext';

// === Shared Components ===
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import ToastContainer from './components/ToastContainer';

// === Route Guards ===
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';

// === Pages: Public ===
import AnaSayfa from './pages/AnaSayfa';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import CollectionPage from './pages/CollectionPage';
import CollectionsPage from './pages/CollectionsPage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';

// === Pages: Auth (Public-Only) ===
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// === Pages: Protected ===
import CheckoutPage from './pages/CheckoutPage';
import FavoritesPage from './pages/FavoritesPage';
import AccountPage from './pages/AccountPage';
import CustomerOrderDetailPage from './pages/CustomerOrderDetailPage';

// === Pages: Kurumsal ===
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ShippingReturnPage from './pages/ShippingReturnPage';
import ToffPromisePage from './pages/ToffPromisePage';
import CorporateSalesPage from './pages/CorporateSalesPage';
import MembershipAgreementPage from './pages/MembershipAgreementPage';
import InfoSocietyPage from './pages/InfoSocietyPage';

// === Pages: Admin ===
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';

// CartProvider'a authTokens geçirmek için ara bileşen
function CartProviderBridge({ children }) {
  const { authTokens } = useAuth();
  return <CartProvider authTokens={authTokens}>{children}</CartProvider>;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Header />

      <Routes>
        {/* ── Ana Sayfa ─────────────────────────────── */}
        <Route path="/" element={<AnaSayfa />} />

        {/* ── Auth (sadece giriş yapmamış) ──────────── */}
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<PublicOnlyRoute><ResetPasswordPage /></PublicOnlyRoute>} />

        {/* ── Ürünler / Kategoriler (public) ────────── */}
        <Route path="/urun/:slug" element={<ProductDetailPage />} />
        <Route path="/koleksiyon/:slug" element={<CollectionPage />} />
        <Route path="/koleksiyonlar" element={<CollectionsPage />} />
        <Route path="/tum-urunler" element={<CategoryPage />} />

        {/* ── Sepet (public) ────────────────────────── */}
        <Route path="/sepet" element={<CartPage />} />

        {/* ── Korumalı Sayfalar ─────────────────────── */}
        <Route path="/odeme" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/favoriler" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        <Route path="/hesabim" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/hesabim/siparisler/:id" element={<ProtectedRoute><CustomerOrderDetailPage /></ProtectedRoute>} />

        {/* ── Admin ─────────────────────────────────── */}
        <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
        <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetailPage /></AdminRoute>} />

        {/* ── Kurumsal / Footer ─────────────────────── */}
        <Route path="/hakkimizda" element={<AboutPage />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/bize-sorun" element={<ContactPage />} />
        <Route path="/sss" element={<FAQPage />} />
        <Route path="/kargo-iade" element={<ShippingReturnPage />} />
        <Route path="/toff-sozu" element={<ToffPromisePage />} />
        <Route path="/kurumsal-satis" element={<CorporateSalesPage />} />
        <Route path="/uyelik-sozlesmesi" element={<MembershipAgreementPage />} />
        <Route path="/bilgi-toplumu-hizmetleri" element={<InfoSocietyPage />} />

        {/* ── Dinamik Kategori Slugları ──────────────── */}
        <Route path="/:slug" element={<CategoryPage />} />
        <Route path="/:parentSlug/:slug" element={<CategoryPage />} />

        {/* ── 404 ───────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <UIProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProviderBridge>
            <AppRoutes />
          </CartProviderBridge>
        </AuthProvider>
      </BrowserRouter>
    </UIProvider>
  );
}

export default App;
