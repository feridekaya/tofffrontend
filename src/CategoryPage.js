import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './CategoryPage.css';
import ProductCard from './ProductCard';

function CategoryPage({ onAddToCart, favorites, toggleFavorite }) {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [sortOption, setSortOption] = useState('-id');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  useEffect(() => {
    // URL'den sayfa numarasını al (yoksa 1)
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam) : 1;
    setCurrentPage(page);

    // 1. Ürünleri çek
    let apiUrl = `http://127.0.0.1:8000/api/products/?category_slug=${slug}&page=${page}`;

    if (sortOption) {
      apiUrl += `&ordering=${sortOption}`;
    }

    axios.get(apiUrl)
      .then(response => {
        // Pagination kontrolü (DRF pagination varsa 'results' döner)
        if (response.data.results) {
          setProducts(response.data.results);
          setNextPageUrl(response.data.next);
          setPrevPageUrl(response.data.previous);
          // Toplam sayfa sayısını hesapla (count / 24)
          setTotalPages(Math.ceil(response.data.count / 24));
        } else {
          // Pagination yoksa (eski yapı veya az ürün)
          setProducts(response.data);
          setTotalPages(1);
        }
      })
      .catch(error => {
        console.error(`'${slug}' için ürünler çekilirken hata oluştu!`, error);
        setProducts([]);
      });

    // 2. Başlığı slug'dan oluştur
    const title = slug.replace(/-/g, ' ').toUpperCase();
    setCategoryName(title);

  }, [slug, sortOption, searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      const banner = document.querySelector('.category-banner-image');
      if (banner) {
        const scrolled = window.pageYOffset;
        banner.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSortChange = (option) => {
    setSortOption(option);
    setIsSortOpen(false);
    // Sıralama değişince 1. sayfaya dön
    setSearchParams({ page: 1 });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
    window.scrollTo(0, 0); // Sayfa değişince yukarı çık
  };

  return (
    <div className="category-page-container">
      <header className="category-header">
        <div className="category-banner">
          <img src={`/assets/${slug}-header.png`} alt={`${categoryName} Header`} className="category-banner-image" />
          <div className="category-banner-overlay">
            <h1>{categoryName}</h1>
          </div>
        </div>
      </header>

      <div className="sort-dropdown-container">
        <div className="sort-dropdown">
          <button className="sort-button" onClick={() => setIsSortOpen(!isSortOpen)}>
            SIRALA {isSortOpen ? '▲' : '▼'}
          </button>
          {isSortOpen && (
            <ul className="sort-menu">
              <li onClick={() => handleSortChange('-created_at')}>Yeni Ürünler</li>
              <li onClick={() => handleSortChange('price')}>Artan Fiyat</li>
              <li onClick={() => handleSortChange('-price')}>Azalan Fiyat</li>
              <li onClick={() => handleSortChange('-id')}>Akıllı Sıralama</li>
            </ul>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Bu kategoride henüz ürün bulunmamaktadır.</p>
      ) : (
        <>
          <div className="product-list">
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={!prevPageUrl}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &lt; Önceki
              </button>

              {/* Sayfa Numaraları */}
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="page-btn"
                disabled={!nextPageUrl}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Sonraki &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CategoryPage;