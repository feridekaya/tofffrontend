import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import productService from '../services/productService';
import { FaUser, FaHeart, FaShoppingBag, FaSignOutAlt, FaSearch, FaTimes, FaBars } from 'react-icons/fa';

function Header() {
  const { authTokens, handleLogout: onLogout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [catBarVisible, setCatBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();

  // Kategori barı GÖRÜNMESELİ sayfalar (sadece mağaza/kategori/ürün sayfaları)
  const HIDDEN_PATHS = [
    '/', '/hakkimizda', '/iletisim', '/bize-sorun',
    '/sss', '/kargo-iade', '/toff-sozu', '/toff-promise',
    '/kurumsal-satis', '/uyelik-sozlesmesi', '/bilgi-toplumu-hizmetleri',
    '/login', '/register', '/forgot-password', '/reset-password',
    '/sepet', '/odeme', '/favoriler', '/hesabim', '/magaza',
  ];
  const showCatBar = !HIDDEN_PATHS.some(p => location.pathname === p)
    && !location.pathname.startsWith('/hesabim/')
    && !location.pathname.startsWith('/admin/');

  // API: koleksiyonlar + kategoriler
  useEffect(() => {
    productService.getCollections()
      .then(res => setCollections(res.data))
      .catch(err => console.error('Koleksiyon hatası:', err));

    productService.getCategories()
      .then(res => {
        const mainCats = res.data.filter(cat => cat.parent === null);
        setCategories(mainCats.map(cat => ({
          ...cat,
          subCategories: res.data.filter(sub => sub.parent === cat.id)
        })));
      })
      .catch(err => console.error('Kategori hatası:', err));
  }, []);

  // Scroll yönü takibi
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) { setCatBarVisible(true); return; }
      setCatBarVisible(y < lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Route değişince barı sıfırla
  useEffect(() => { setCatBarVisible(true); lastScrollY.current = 0; }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/ tum - urunler ? search = ${encodeURIComponent(searchTerm)} `);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  // Kullanıcının belirlediği menü sırası (backend gerçek slug'ları)
  const MENU_ORDER = [
    'masalar',
    'oturma-elemanlari',
    'sehpalar',
    'sergileme-duzenleme',
    'dis-mekan',
    'mekan-cozumleri',
    'little-paws',
  ];

  const getDynamicMenu = () => {
    // Kategorileri istenen sıraya göre sırala
    const sortedCats = [...categories].sort((a, b) => {
      const ia = MENU_ORDER.indexOf(a.slug);
      const ib = MENU_ORDER.indexOf(b.slug);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

    const menu = [
      {
        title: 'KOLEKSİYONLAR', path: '/koleksiyonlar',
        subCategories: collections.map(col => ({ title: col.name, path: `/koleksiyon/${col.slug}` }))
      }
    ];
    sortedCats.forEach(cat => {
      menu.push({
        title: cat.name.toUpperCase(),
        path: `/${cat.slug}`,
        subCategories: cat.subCategories.map(sub => ({ title: sub.name, path: `/${cat.slug}/${sub.slug}` }))
      });
    });
    // Tüm Ürünler en sona
    menu.push({ title: 'TÜM ÜRÜNLER', path: '/tum-urunler', subCategories: [] });
    return menu;
  };

  const menuItems = getDynamicMenu();

  // Aktif URL yolu üzerindeki ana kategorinin adını bul
  const currentCategoryMenu = menuItems.find(item =>
    item.path === location.pathname ||
    item.subCategories.some(sub => sub.path === location.pathname)
  );

  // Hover edilen bir kategori varsa onu, yoksa şu anda içinde bulunduğumuz kategoriyi göster
  const displayedMenuTitle = activeMenu || (currentCategoryMenu ? currentCategoryMenu.title : null);

  const iconClass = 'flex items-center justify-center w-9 h-9 text-toff-muted hover:text-toff-accent transition-colors relative';

  return (
    <>
      <header className="bg-toff-bg border-b border-toff-border-2 sticky top-0 z-40">

        {/* ── Top Bar ──────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          {/* Left: Mobile hamburger + Logo + Desktop Nav */}
          <div className="flex items-center gap-4">
            {/* Mobile hamburger — prod sayfalarında yalnızca mobil, diğerlerinde her zaman görünür */}
            <button
              className={`${showCatBar ? 'lg:hidden' : ''} flex items-center justify-center w-9 h-9 text-toff-muted hover:text-toff-text transition-colors`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <FaBars />
            </button>

            {/* Logo */}
            <Link to="/" className="text-xl font-black tracking-[0.3em] text-toff-accent hover:text-toff-accent-2 transition-colors">
              TOFF
            </Link>

            {/* Desktop top nav links */}
            <nav className="hidden lg:flex items-center gap-6 ml-4">
              {[
                { to: '/koleksiyonlar', label: 'Koleksiyonlar' },
                { to: '/magaza', label: 'Mağaza' },
                { to: '/hakkimizda', label: 'Hakkımızda' },
              ].map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${isActive ? 'text-toff-accent' : 'text-toff-muted hover:text-toff-text'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)} className={iconClass} aria-label="Ara">
              <FaSearch size={15} />
            </button>
            <Link to="/favoriler" className={iconClass} aria-label="Favoriler">
              <FaHeart size={15} />
            </Link>
            {authTokens ? (
              <>
                <Link to="/hesabim" className={iconClass} aria-label="Hesabım">
                  <FaUser size={15} />
                </Link>
                <button onClick={onLogout} className={`${iconClass} hover:text-red-400`} aria-label="Çıkış">
                  <FaSignOutAlt size={15} />
                </button>
              </>
            ) : (
              <Link to="/login" className={iconClass} aria-label="Giriş yap">
                <FaUser size={15} />
              </Link>
            )}
            <Link to="/sepet" className={`${iconClass} ml-1`} aria-label="Sepet">
              <FaShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-toff-accent text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ── Bottom Bar: Mega Menü (Desktop) ──────────────────────── */}
        {showCatBar && (
          <div
            className={`hidden lg:block border-t border-toff-border-2 relative transition-all duration-300
            ${catBarVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="max-w-7xl mx-auto px-6">
              <nav>
                <ul className="flex items-center gap-8">
                  {menuItems.map(item => (
                    <li key={item.title} onMouseEnter={() => setActiveMenu(item.title)}>
                      <Link
                        to={item.path}
                        className={`block py-3 text-[11px] font-bold tracking-widest transition-colors ${activeMenu === item.title ? 'text-toff-accent' : 'text-toff-muted hover:text-toff-text'}`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Mega Menü Dropdown (Açık Kalan Versiyon) */}
            {displayedMenuTitle && menuItems.find(i => i.title === displayedMenuTitle)?.subCategories.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-black/50 backdrop-blur-md border-t border-b border-toff-accent/20 shadow-2xl transition-all duration-300 origin-top z-50">
                <div className="max-w-7xl mx-auto px-6 py-6">
                  <div className="flex gap-12">
                    {/* Sol Görsel / Açıklama Kısmı (İstersen Sabit) */}
                    <div className="hidden lg:flex w-1/4 flex-col justify-center border-r border-white/5 pr-8">
                      <p className="text-xs tracking-[0.3em] text-toff-accent font-bold uppercase mb-2">
                        Koleksiyon
                      </p>
                      <h3 className="text-xl font-black text-white leading-tight mb-2">
                        {displayedMenuTitle}
                      </h3>
                    </div>
                    {/* Sağ Linkler */}
                    <ul className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-3">
                      {menuItems.find(i => i.title === displayedMenuTitle).subCategories.map(sub => {
                        const isActiveSub = location.pathname === sub.path;
                        return (
                          <li key={sub.title} className="group flex items-center">
                            <div className={`w-1 h-1 rounded-full mr-3 transition-transform duration-300 group-hover:scale-150 group-hover:bg-toff-accent ${isActiveSub ? 'bg-toff-accent scale-150' : 'bg-toff-accent/30'}`} />
                            <Link
                              to={sub.path}
                              onClick={() => setActiveMenu(null)}
                              className={`text-[13px] tracking-wide transition-all duration-300 group-hover:translate-x-1.5 font-medium ${isActiveSub ? 'text-white translate-x-1.5 font-bold' : 'text-toff-faint hover:text-white'}`}
                            >
                              {sub.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Mobile Drawer ─────────────────────────────────────────── */}
        {mobileOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 z-30" onClick={() => setMobileOpen(false)} />
            <div className="fixed top-0 left-0 h-full w-72 bg-toff-bg-2 z-40 flex flex-col shadow-2xl animate-slide-right">
              <div className="flex items-center justify-between px-5 py-4 border-b border-toff-border">
                <span className="text-lg font-black tracking-[0.3em] text-toff-accent">TOFF</span>
                <button onClick={() => setMobileOpen(false)} className="text-toff-muted hover:text-toff-text">
                  <FaTimes />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3">
                {menuItems.map(item => (
                  <div key={item.title} className="mb-1">
                    <Link
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 text-sm font-bold tracking-wider text-toff-muted hover:text-toff-accent hover:bg-toff-bg-3 rounded-lg transition-colors"
                    >
                      {item.title}
                    </Link>
                    {item.subCategories.length > 0 && (
                      <div className="pl-5 mt-0.5 flex flex-col gap-0.5">
                        {item.subCategories.map(sub => (
                          <Link
                            key={sub.title}
                            to={sub.path}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 text-[13px] text-toff-faint hover:text-toff-accent hover:bg-toff-bg-3 rounded-lg transition-colors"
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </>
        )}
      </header>

      {/* ── Arama Overlay ─────────────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-start pt-24 px-4">
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-6 right-6 text-toff-muted hover:text-toff-text transition-colors"
          >
            <FaTimes size={22} />
          </button>

          <form onSubmit={handleSearch} className="w-full max-w-2xl flex items-center gap-3">
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent border-b-2 border-toff-border focus:border-toff-accent text-toff-text text-2xl font-light py-3 outline-none transition-colors placeholder:text-toff-faint"
            />
            <button type="submit" className="text-toff-accent hover:text-toff-accent-2 transition-colors p-2">
              <FaSearch size={22} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs font-bold text-toff-faint uppercase tracking-widest mb-3">Popüler Aramalar</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Masa', 'Sandalye', 'Sehpa'].map(tag => (
                <Link
                  key={tag}
                  to={`/tum-urunler?search=${tag.toLowerCase()}`}
                  onClick={() => setSearchOpen(false)}
                  className="border border-toff-border text-toff-muted hover:border-toff-accent hover:text-toff-accent text-sm px-4 py-1.5 rounded-full transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
