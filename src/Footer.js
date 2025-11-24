import React from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaRuler, FaShieldAlt } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">

      {/* 1. BÖLÜM: Üstteki İkonlu Alan - Value Proposition Strip */}
      <div className="footer-perks">
        <div className="perk">
          <FaTruck size={32} color="#C08B5C" />
          <div>
            <h4>ÜCRETSİZ & SİGORTALI TESLİMAT</h4>
            <p>Tüm Türkiye'ye güvenli gönderim.</p>
          </div>
        </div>
        <div className="perk">
          <FaRuler size={32} color="#C08B5C" />
          <div>
            <h4>ÖZEL ÖLÇÜ İMKANI</h4>
            <p>Evinize tam uyan ölçülerde üretim.</p>
          </div>
        </div>
        <div className="perk">
          <FaShieldAlt size={32} color="#C08B5C" />
          <div>
            <h4>%100 EL İŞÇİLİĞİ</h4>
            <p>Masif ahşap ve metalin usta ellerdeki uyumu.</p>
          </div>
        </div>
      </div>

      {/* 2. BÖLÜM: Çok Sütunlu Link Alanı */}
      <div className="footer-links">
        <div className="footer-column">
          <h4>THE TOFF HAKKINDA</h4>
          <ul>
            <li><Link to="/hakkimizda">Hakkımızda</Link></li>
            <li><Link to="/kurumsal-satis">Kurumsal Satış</Link></li>
            <li><Link to="/bilgi-toplumu-hizmetleri">Bilgi Toplumu Hizmetleri</Link></li>
            <li><Link to="/toff-promise">The Toff Promise</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>MÜŞTERİ HİZMETLERİ</h4>
          <ul>
            <li><Link to="/bize-sorun">Bize Sorun</Link></li>
            <li><Link to="/sss">Sıkça Sorulan Sorular</Link></li>
            <li><Link to="/kargo-iade">Ücretsiz Kargo ve İade</Link></li>
            <li><Link to="/uyelik-sozlesmesi">Üyelik Sözleşmesi</Link></li>
            <li><Link to="/bize-sorun">İletişim</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>HESABIM</h4>
          <ul>
            <li><Link to="/hesabim?view=orders">Siparişlerim</Link></li>
            <li><Link to="/hesabim?view=addresses">Adreslerim</Link></li>
            <li><Link to="/hesabim?view=userInfo">Üyelik Bilgilerim</Link></li>
          </ul>
        </div>

        {/* Sosyal Medya Linkleri */}
        <div className="footer-column">
          <h4>BİZİ TAKİP EDİN</h4>
          <div className="social">
            <a href="https://www.instagram.com/thetoffdesign/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://wa.me/905424509342" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="https://www.pinterest.com/thetoffdesign/" target="_blank" rel="noopener noreferrer">Pinterest</a>
            <a href="https://www.tiktok.com/@thetoffdesign?lang=tr-TR" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </div>
      </div>

      {/* 3. BÖLÜM: Telif Hakkı (Copyright) */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TheToff. Tüm hakları saklıdır.</p>
      </div>

    </footer>
  );
}

export default Footer;