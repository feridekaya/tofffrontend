import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import './HomePage.css';
import HomepageHeader from './HomepageHeader';
import API_BASE_URL from './config/api';

function AnaSayfa() {
  const [collections, setCollections] = useState([]);
  const collectionsRef = useRef(null);

  useEffect(() => {
    // Fetch collections from API
    axios.get(`${API_BASE_URL}/api/collections/`)
      .then(response => {
        setCollections(response.data);
      })
      .catch(error => {
        console.error('Koleksiyonlar yüklenemedi:', error);
      });
  }, []);

  const scrollToCollections = () => {
    collectionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="immersive-homepage">
      <HomepageHeader />

      {/* Section 1: Video Hero */}
      <section className="hero-section">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/hero-poster.jpg"
        >
          <source
            src="/assets/hero-video.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1 className="hero-title">TOFF</h1>
          <p className="hero-subtitle">Endüstriyel Ruh, Doğal Dokunuş</p>
          <p className="hero-description">
            Atölyeden evinize, %100 el işçiliği ile üretilen zamansız tasarımlar
          </p>

          <div className="scroll-indicator" onClick={scrollToCollections}>
            <span>Keşfet</span>
            <FaChevronDown className="scroll-arrow" />
          </div>
        </div>
      </section>

      {/* Collection Sections */}
      <div ref={collectionsRef}>
        {collections.map((collection, index) => {
          // Helper to construct valid image URL
          const getImageUrl = (img) => {
            if (!img) return null;
            if (img.startsWith('http')) return img;
            // Remove leading slash if both have it to avoid double slash, though usually fine
            return `${API_BASE_URL}${img}`;
          };

          const bgImage = getImageUrl(collection.image) || `/assets/collection-${collection.slug}.png`;

          return (
            <section
              key={collection.slug}
              className="collection-section"
              style={{ backgroundImage: `url('${bgImage}')` }}
            >
              <div className="collection-overlay"></div>

              <Link to={`/koleksiyon/${collection.slug}`} className="collection-content">
                <div className="collection-number">0{index + 1}</div>
                <h2 className="collection-title">{collection.name}</h2>
                <p className="collection-subtitle">{collection.description || 'Özel tasarım koleksiyonu'}</p>
                <span className="collection-cta">Koleksiyonu Keşfet →</span>
              </Link>
            </section>
          );
        })}
      </div>

      {/* Final Section: Brand Story */}
      <section className="story-section">
        <div className="story-content">
          <h2 className="story-title">Mekana Özgü Tasarım</h2>
          <p className="story-text">
            Standartlara sığmayın. Hayalinizdeki mobilyayı sizin ölçülerinize
            ve renklerinize göre üretiyoruz. Teknik çizimden üretime,
            her aşamada sizinleyiz.
          </p>
          <div className="story-actions">
            <Link to="/kurumsal-satis" className="story-btn primary">
              Kurumsal Çözümler
            </Link>
            <Link to="/iletisim" className="story-btn secondary">
              Özel Sipariş
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default AnaSayfa;
