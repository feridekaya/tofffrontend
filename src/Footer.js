
import React from 'react';
import './Footer.css'; // Stil dosyamızı import ediyoruz (birazdan oluşturacağız)

function Footer() {
  return (
    <footer className="site-footer">
      
      {/* 1. BÖLÜM: Üstteki İkonlu Alan */}
      <div className="footer-perks">
        <div className="perk">
          <span>Icon</span> {/* Buraya ikon gelecek */}
          <div>
            <h4>ÜCRETSİZ KARGO</h4>
            <p>Tüm siparişlerinizde kargo ücretsiz.</p>
          </div>
        </div>
        <div className="perk">
          <span>Icon</span> {/* Buraya ikon gelecek */}
          <div>
            <h4>MAĞAZADAN TESLİM</h4>
            <p>Online alışveriş, mağazadan teslimat.</p>
          </div>
        </div>
        <div className="perk">
          <span>Icon</span> {/* Buraya ikon gelecek */}
          <div>
            <h4>KOLAY İADE</h4>
            <p>Aldığınız ürünleri kolayca iade edebilirsiniz.</p>
          </div>
        </div>
      </div>

      {/* 2. BÖLÜM: Çok Sütunlu Link Alanı */}
      <div className="footer-links">
        <div className="footer-column">
          <h4>THE TOFF HAKKINDA</h4>
          <ul>
            <li><a href="/">Hakkımızda</a></li>
            <li><a href="/">Kurumsal Satış</a></li>
            <li><a href="/">Bilgi Toplumu Hizmetleri</a></li>
            <li><a href="/">The Toff Promise</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>MÜŞTERİ HİZMETLERİ</h4>
          <ul>
            <li><a href="/">Bize Sorun</a></li>
            <li><a href="/">Sıkça Sorulan Sorular</a></li>
            <li><a href="/">Ücretsiz Kargo ve İade</a></li>
            <li><a href="/">Üyelik Sözleşmesi</a></li>
            <li><a href="/">İletişim</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>HESABIM</h4>
          <ul>
            <li><a href="/">Siparişlerim</a></li>
            <li><a href="/">Adreslerim</a></li>
            <li><a href="/">Üyelik Bilgilerim</a></li>
          </ul>
        </div>
        
        {/* Senin Sosyal Medya Linklerin */}
        <div className="footer-column">
          <h4>BİZİ TAKİP EDİN</h4>
          {/* NOT: Bu linklerdeki ikonları (<i class...>) 
            göstermek için "React Icons" gibi bir kütüphane 
            kurmamız gerekecek. Şimdilik metin olarak ekliyorum.
          */}
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