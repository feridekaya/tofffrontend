import React, { useState } from 'react'; 
import './Header.css';
import { Link } from 'react-router-dom';
import { menuData } from './menuData'; 

// 1. Gerekli tüm ikonları import et
import { FaUser, FaHeart, FaShoppingBag, FaSignOutAlt } from 'react-icons/fa';

// 2. Gerekli tüm prop'ları al (cart, authTokens, onLogout)
function Header({ cart, authTokens, onLogout }) {

  // --- Mega Menü için State ---
  const [activeMenu, setActiveMenu] = useState(null);

  // --- Sepet Rozeti (Badge) için Hesaplama ---
  const totalItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // --- Mega Menü Fonksiyonları ---
  const handleMouseEnter = (menuTitle) => {
    setActiveMenu(menuTitle);
  };
  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <header className="site-header">
      
      {/* ÜST SATIR: Logo, Arama, İkonlar */}
      <div className="header-top">
        <div className="logo">
          <Link to="/">TheToff</Link> 
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Hadi gel aradığını hızlıca bulalım..." />
        </div>

        {/* 3. DÜZELTİLMİŞ HEADER-ICONS BÖLÜMÜ */}
        <div className="header-icons">

          {/* 1. Akıllı Giriş Yapma / Hesabım Mantığı */}
          {authTokens ? (
            // EĞER GİRİŞ YAPILMIŞSA
            <>
              <Link to="/hesabim" className="icon-link">
                <FaUser />
                <span className="icon-text">Hesabım</span>
              </Link>
              <button onClick={onLogout} className="icon-link logout-btn">
                <FaSignOutAlt />
                <span className="icon-text">Çıkış Yap</span>
              </button>
            </>
          ) : (
            // EĞER GİRİŞ YAPILMAMIŞSA
            <Link to="/login" className="icon-link">
              <FaUser />
              <span className="icon-text">Giriş Yap</span>
            </Link>
          )}
          
          {/* 2. Favoriler Linki (Her zaman görünür) */}
          <Link to="/favoriler" className="icon-link">
            <FaHeart />
            <span className="icon-text">Favoriler</span>
          </Link>
          
          {/* 3. Sepet Linki (Her zaman görünür) */}
          <Link to="/sepet" className="icon-link cart-link"> 
            <FaShoppingBag />
            <span className="icon-text">Sepet</span>
            {totalItemCount > 0 && (
              <span className="cart-badge">{totalItemCount}</span>
            )}
          </Link> 

        </div> {/* <-- .header-icons burada biter */}
      </div> {/* <-- .header-top burada biter */}

      {/* ALT SATIR: Navigasyon Linkleri (Mega Menü) */}
      <div className="header-bottom" onMouseLeave={handleMouseLeave}>
        <nav className="main-nav">
          <ul>
            {menuData.map((item) => (
              <li 
                key={item.title}
                onMouseEnter={() => handleMouseEnter(item.title)} 
              >
                <Link to={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* MEGA MENÜ PANELİ (Değişiklik yok) */}
        {activeMenu && menuData.find(item => item.title === activeMenu)?.subCategories.length > 0 && (
          <div className="mega-menu-panel">
            <div className="mega-menu-content">
              <ul>
                {menuData.find(item => item.title === activeMenu).subCategories.map((subItem) => (
                  <li key={subItem.title}>
                    <Link to={subItem.path}>{subItem.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
// <-- FAZLADAN '}' PARANTEZİ SİLİNDİ