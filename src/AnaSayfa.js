import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import './HomePage.css';
import HomepageHeader from './HomepageHeader';

function AnaSayfa() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // Fetch collections from API
    axios.get('http://127.0.0.1:8000/api/collections/')
      .then(response => {
        setCollections(response.data);
      })
      .catch(error => {
        console.error('Koleksiyonlar yüklenemedi:', error);
      });
  }, []);

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

          <div className="scroll-indicator">
            <span>Keşfet</span>
            <FaChevronDown className="scroll-arrow" />
          </div>
        </div>
      </section>

      {/* Collection Sections */}
      {collections.map((collection, index) => (
        <section
          key={collection.slug}
          className="collection-section"
          style={{ backgroundImage: `url('${collection.image || `/assets/collection-${collection.slug}.png`}')` }}
        >
          <div className="collection-overlay"></div>

          <Link to={`/koleksiyon/${collection.slug}`} className="collection-content">
            <div className="collection-number">0{index + 1}</div>
            <h2 className="collection-title">{collection.name}</h2>
            <p className="collection-subtitle">{collection.description || 'Özel tasarım koleksiyonu'}</p>
            <span className="collection-cta">Koleksiyonu Keşfet →</span>
          </Link>
        </section>
      ))}

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