// frontend/src/menuData.js

export const menuData = [
  {
    title: 'TÜM ÜRÜNLER',
    path: '/tum-urunler',
    subCategories: [],
  },
  {
    title: 'KOLEKSİYONLAR',
    path: '/koleksiyonlar',
    subCategories: [
      { title: 'Yeni Gelenler', path: '/yeni-gelenler' },
      { title: 'En Çok Satanlar', path: '/tum-urunler' },
    ],
  },
  {
    title: 'MASALAR',
    path: '/masalar',
    subCategories: [
      { title: 'Yemek Masaları', path: '/masalar/yemek-masalari' },
      { title: 'Çalışma & Ofis Masaları', path: '/masalar/calisma-ofis' },
      { title: 'Mutfak Masaları', path: '/masalar/mutfak-masalari' },
      { title: 'Toplantı Masaları', path: '/masalar/toplanti-masalari' },
      { title: 'Bar Masaları', path: '/masalar/bar-masalari' },
    ],
  },
  {
    title: 'SEHPALAR',
    path: '/sehpalar',
    subCategories: [
      { title: 'Orta Sehpalar', path: '/sehpalar/orta-sehpalar' },
      { title: 'Yan Sehpalar', path: '/sehpalar/yan-sehpalar' },
      { title: 'Dresuarlar', path: '/sehpalar/dresuarlar' },
    ],
  },
  {
    title: 'OTURMA ELEMANLARI',
    path: '/oturma-elemanlari',
    subCategories: [
      { title: 'Sandalyeler', path: '/oturma/sandalyeler' },
      { title: 'Banklar (Benchler)', path: '/oturma/banklar' },
      { title: 'Bar Tabureleri', path: '/oturma/bar-tabureleri' },
      { title: 'Tabureler', path: '/oturma/tabureler' },
    ],
  },
  {
    title: 'KİTAPLIKLAR & RAFLAR',
    path: '/kitapliklar-raflar',
    subCategories: [
      { title: 'Kitaplıklar', path: '/kitapliklar-raflar/kitapliklar' },
      { title: 'TV Üniteleri', path: '/kitapliklar-raflar/tv-uniteleri' },
      { title: 'Duvar Rafları', path: '/kitapliklar-raflar/duvar-raflari' },
      { title: 'Askılıklar', path: '/kitapliklar-raflar/askiliklar' },
      { title: 'Antre Çözümleri / Ayakkabılık', path: '/kitapliklar-raflar/antre' },
      { title: 'Havluluklar', path: '/kitapliklar-raflar/havluluklar' },
    ],
  },
  {
    title: 'AKSESUARLAR',
    path: '/aksesuar',
    subCategories: [
      { title: 'Saksılıklar', path: '/aksesuar/saksiliklar' },
      { title: 'Aydınlatma (Lambaderler)', path: '/aksesuar/aydinlatma' },
      { title: 'Şamdanlar', path: '/aksesuar/samdanlar' },
    ],
  },
];