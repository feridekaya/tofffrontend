import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { menuData } from './menuData';
import axios from 'axios';

// 1. Gerekli tüm ikonları import et
import { FaUser, FaHeart, FaShoppingBag, FaSignOutAlt, FaSearch, FaTimes } from 'react-icons/fa';

// 2. Gerekli tüm prop'ları al (cart, authTokens, onLogout)
function Header({ cart, authTokens, onLogout }) {
  const navigate = useNavigate();

  // --- Mega Menü için State ---
  const [activeMenu, setActiveMenu] = useState(null);
  // --- Arama Overlay için State ---
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // --- Koleksiyonlar için State ---
  const [collections, setCollections] = useState([]);

  // --- Sepet Rozeti (Badge) için Hesaplama ---
  const totalItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Koleksiyonları API'den çek
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/collections/')
      .then(response => {
        setCollections(response.data);
      })
      .catch(error => {
        console.error('Koleksiyonlar yüklenemedi:', error);
      });
  }, []);

  // --- Arama Fonksiyonu ---
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tum-urunler?search=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  // --- Mega Menü Fonksiyonları ---
  const handleMouseEnter = (menuTitle) => {
    setActiveMenu(menuTitle);
  };
  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  // Menü datasını koleksiyonlarla birleştir
  const getMenuWithCollections = () => {
    return menuData.map(item => {
      if (item.title === 'KOLEKSİYONLAR') {
        return {
          ...item,
          subCategories: collections.map(col => ({
            title: col.name,
            path: `/koleksiyon/${col.slug}`
          }))
        };
      }
      return item;
    });
  };

  const menuWithCollections = getMenuWithCollections();

  return (
    <>
      <header className="site-header">

        {/* ÜST SATIR: Logo Solda, Linkler Yanında, İkonlar Sağda */}
        <div className="header-top">

          <div className="header-left-group">
            {/* Logo */}
            <div className="logo-area">
              <Link to="/">TOFF</Link>
            </div>

            {/* Yeni Linkler */}
            <nav className="header-top-nav">
              <NavLink to="/koleksiyonlar" className={({ isActive }) => isActive ? "active" : ""}>Koleksiyonlar</NavLink>
              <NavLink to="/tum-urunler" className={({ isActive }) => isActive ? "active" : ""}>Mağaza</NavLink>
              <NavLink to="/hakkimizda" className={({ isActive }) => isActive ? "active" : ""}>Hakkımızda</NavLink>
            </nav>
          </div>

          {/* Sağda İkonlar */}
          <div className="header-icons">
            {/* Arama İkonu */}
            <button onClick={() => setSearchOpen(true)} className="icon-link icon-only">
              <FaSearch />
            </button>

            {/* Favoriler */}
            <Link to="/favoriler" className="icon-link icon-only">
              <FaHeart />
            </Link>

            {/* Kullanıcı */}
            {authTokens ? (
              <>
                <Link to="/hesabim" className="icon-link icon-only">
                  <FaUser />
                </Link>
                <button onClick={onLogout} className="icon-link icon-only logout-btn">
                  <FaSignOutAlt />
                </button>
              </>
            ) : (
              <Link to="/login" className="icon-link icon-only">
                <FaUser />
              </Link>
            )}

            {/* Sepet */}
            <Link to="/sepet" className="icon-link icon-only cart-link">
              <FaShoppingBag />
              {totalItemCount > 0 && (
                <span className="cart-badge">{totalItemCount}</span>
              )}
            </Link>

          </div>
        </div>

        {/* ALT SATIR: Navigasyon Linkleri (Mega Menü) */}
        <div className="header-bottom" onMouseLeave={handleMouseLeave}>
          <nav className="main-nav">
            <ul>
              {menuWithCollections.map((item) => (
                <li
                  key={item.title}
                  onMouseEnter={() => handleMouseEnter(item.title)}
                >
                  <Link to={item.path}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* MEGA MENÜ PANELİ */}
          {activeMenu && menuWithCollections.find(item => item.title === activeMenu)?.subCategories.length > 0 && (
            <div className="mega-menu-panel">
              <div className="mega-menu-content">
                <ul>
                  {menuWithCollections.find(item => item.title === activeMenu).subCategories.map((subItem) => (
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

      {/* ARAMA OVERLAY */}
      {searchOpen && (
        <div className="search-overlay">
          <div className="search-overlay-content">
            <button onClick={() => setSearchOpen(false)} className="search-close">
              <FaTimes />
            </button>

            <form onSubmit={handleSearch} className="search-overlay-form">
              <input
                type="text"
                placeholder="Arama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="search-overlay-input"
              />
              <button type="submit" className="search-overlay-submit">
                <FaSearch />
              </button>
            </form>

            <div className="popular-searches">
              <h3>Popüler Aramalar</h3>
              <div className="popular-tags">
                <Link to="/tum-urunler?search=masa" onClick={() => setSearchOpen(false)}>Masa</Link>
                <Link to="/tum-urunler?search=sandalye" onClick={() => setSearchOpen(false)}>Sandalye</Link>
                <Link to="/tum-urunler?search=sehpa" onClick={() => setSearchOpen(false)}>Sehpa</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;