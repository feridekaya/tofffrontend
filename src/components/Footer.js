import React from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaRuler, FaShieldAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-toff-bg border-t border-toff-border-2 mt-auto">

      {/* ── Değer Önerileri ───────────────────────────────────────── */}
      <div className="border-b border-toff-border-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: <FaTruck size={28} className="text-toff-accent" />,
              title: 'ÜCRETSİZ & SİGORTALI TESLİMAT',
              desc: 'Tüm Türkiye\'ye güvenli gönderim.'
            },
            {
              icon: <FaRuler size={28} className="text-toff-accent" />,
              title: 'ÖZEL ÖLÇÜ İMKANI',
              desc: 'Evinize tam uyan ölçülerde üretim.'
            },
            {
              icon: <FaShieldAlt size={28} className="text-toff-accent" />,
              title: '%100 EL İŞÇİLİĞİ',
              desc: 'Masif ahşap ve metalin usta ellerdeki uyumu.'
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="shrink-0 mt-1">{item.icon}</div>
              <div>
                <h4 className="text-xs font-bold text-toff-text tracking-widest mb-1">{item.title}</h4>
                <p className="text-sm text-toff-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Link Bölümleri ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {[
          {
            title: 'THE TOFF HAKKINDA',
            links: [
              { to: '/hakkimizda', label: 'Hakkımızda' },
              { to: '/kurumsal-satis', label: 'Kurumsal Satış' },
              { to: '/bilgi-toplumu-hizmetleri', label: 'Bilgi Toplumu Hizmetleri' },
              { to: '/toff-promise', label: 'The Toff Promise' },
            ]
          },
          {
            title: 'MÜŞTERİ HİZMETLERİ',
            links: [
              { to: '/bize-sorun', label: 'Bize Sorun' },
              { to: '/sss', label: 'Sıkça Sorulan Sorular' },
              { to: '/kargo-iade', label: 'Ücretsiz Kargo ve İade' },
              { to: '/uyelik-sozlesmesi', label: 'Üyelik Sözleşmesi' },
              { to: '/bize-sorun', label: 'İletişim' },
            ]
          },
          {
            title: 'HESABIM',
            links: [
              { to: '/hesabim?view=orders', label: 'Siparişlerim' },
              { to: '/hesabim?view=addresses', label: 'Adreslerim' },
              { to: '/hesabim?view=userInfo', label: 'Üyelik Bilgilerim' },
            ]
          },
          null // Sosyal medya özel render
        ].map((col, i) => {
          if (!col) {
            return (
              <div key={i}>
                <h4 className="text-[11px] font-bold tracking-widest text-toff-text mb-4 uppercase">Bizi Takip Edin</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { href: 'https://www.instagram.com/thetoffdesign/', label: 'Instagram' },
                    { href: 'https://wa.me/905424509342', label: 'WhatsApp' },
                    { href: 'https://www.pinterest.com/thetoffdesign/', label: 'Pinterest' },
                    { href: 'https://www.tiktok.com/@thetoffdesign?lang=tr-TR', label: 'TikTok' },
                  ].map(link => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-toff-muted hover:text-toff-accent transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            );
          }
          return (
            <div key={i}>
              <h4 className="text-[11px] font-bold tracking-widest text-toff-text mb-4 uppercase">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-toff-muted hover:text-toff-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* ── Copyright ─────────────────────────────────────────────── */}
      <div className="border-t border-toff-border-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-toff-faint">
            © {new Date().getFullYear()} TheToff. Tüm hakları saklıdır.
          </p>
          <span className="text-[10px] font-black tracking-[0.3em] text-toff-accent opacity-60">TOFF</span>
        </div>
      </div>

    </footer>
  );
}

export default Footer;
