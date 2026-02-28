import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import API_BASE_URL from '../config/api';
import { useAuth } from '../context/AuthContext';
import { FiSliders } from 'react-icons/fi';

const SORT_OPTIONS = [
  { value: '-created_at', label: 'Yeni Ürünler' },
  { value: 'price', label: 'Artan Fiyat' },
  { value: '-price', label: 'Azalan Fiyat' },
  { value: '-id', label: 'Akıllı Sıralama' },
];

function CategoryPage() {
  const { handleAddToCart: onAddToCart, favorites, toggleFavorite } = useAuth();
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [headerSlug, setHeaderSlug] = useState(slug);
  const [sortOption, setSortOption] = useState('-id');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  useEffect(() => {
    setLoading(true);
    const page = parseInt(searchParams.get('page') || '1');
    const searchQuery = searchParams.get('search');
    setCurrentPage(page);

    let apiUrl = `${API_BASE_URL}/api/products/?category_slug=${slug}&page=${page}&ordering=${sortOption}`;
    if (searchQuery) apiUrl += `&search=${encodeURIComponent(searchQuery)}`;

    axios.get(apiUrl)
      .then(res => {
        if (res.data.results) {
          setProducts(res.data.results);
          setNextPageUrl(res.data.next);
          setPrevPageUrl(res.data.previous);
          setTotalPages(Math.ceil(res.data.count / 24));
        } else {
          setProducts(res.data);
          setTotalPages(1);
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));

    axios.get(`${API_BASE_URL}/api/categories/${slug}/`)
      .then(res => {
        setCategoryName(res.data.name.toUpperCase());
        setHeaderSlug(res.data.header_slug);
      })
      .catch(() => {
        setCategoryName(slug.replace(/-/g, ' ').toUpperCase());
        setHeaderSlug(slug);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, sortOption, searchParams]);

  const handleSortChange = (option) => {
    setSortOption(option);
    setIsSortOpen(false);
    setSearchParams({ page: 1 });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-toff-bg">

      {/* ── Banner ──────────────────────────────────────────────────── */}
      <div className="relative h-48 sm:h-64 lg:h-72 overflow-hidden">
        <img
          src={`/assets/${headerSlug}-header.png`}
          alt={categoryName}
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-toff-bg via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end justify-center pb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-[0.25em] text-white drop-shadow-lg">
            {categoryName}
          </h1>
        </div>
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <p className="text-sm text-toff-muted">
          {loading ? 'Yükleniyor...' : `${products.length} ürün`}
        </p>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 border border-toff-border text-toff-muted hover:border-toff-accent hover:text-toff-accent text-xs font-bold px-4 py-2 rounded-lg transition-colors"
          >
            <FiSliders size={13} />
            SIRALA {isSortOpen ? '▲' : '▼'}
          </button>
          {isSortOpen && (
            <ul className="absolute right-0 top-full mt-2 w-44 bg-toff-bg-2 border border-toff-border rounded-lg overflow-hidden shadow-2xl z-20">
              {SORT_OPTIONS.map(opt => (
                <li
                  key={opt.value}
                  onClick={() => handleSortChange(opt.value)}
                  className={`px-4 py-3 text-sm cursor-pointer transition-colors ${sortOption === opt.value ? 'bg-toff-accent/10 text-toff-accent' : 'text-toff-muted hover:bg-toff-bg-3 hover:text-toff-text'}`}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Ürün Grid ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-toff-muted gap-3">
            <div className="w-8 h-8 border-2 border-toff-border border-t-toff-accent rounded-full animate-spin" />
            Ürünler yükleniyor...
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-toff-muted">
            Bu kategoride henüz ürün bulunmamaktadır.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  disabled={!prevPageUrl}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 border border-toff-border text-toff-muted hover:border-toff-accent hover:text-toff-accent rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ‹ Önceki
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-toff-accent text-white' : 'border border-toff-border text-toff-muted hover:border-toff-accent hover:text-toff-accent'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={!nextPageUrl}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-2 border border-toff-border text-toff-muted hover:border-toff-accent hover:text-toff-accent rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Sonraki ›
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
