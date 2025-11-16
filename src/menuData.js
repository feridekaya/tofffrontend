// frontend/src/menuData.js

export const menuData = [
  {
    title: 'MASALAR',
    path: '/masalar', // Ana link
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
    title: 'DEPOLAMA & DÜZENLEME',
    path: '/depolama',
    subCategories: [
      { title: 'Kitaplıklar', path: '/depolama/kitapliklar' },
      { title: 'TV Üniteleri', path: '/depolama/tv-uniteleri' },
      { title: 'Duvar Rafları', path: '/depolama/duvar-raflari' },
      { title: 'Askılıklar', path: '/depolama/askiliklar' },
      { title: 'Antre Çözümleri / Ayakkabılık', path: '/depolama/antre' },
      { title: 'Havluluklar', path: '/depolama/havluluklar' },
    ],
  },
  {
    title: 'DIŞ MEKAN (OUTDOOR)',
    path: '/dis-mekan',
    subCategories: [
      { title: 'Dış Mekan Masaları', path: '/dis-mekan/masalar' },
      { title: 'Dış Mekan Sandalyeleri', path: '/dis-mekan/sandalyeler' },
      { title: 'Dış Mekan Oturma Grubu', path: '/dis-mekan/oturma-grubu' },
      { title: 'Şezlonglar', path: '/dis-mekan/sezlonglar' },
      { title: 'Salıncaklar', path: '/dis-mekan/salincaklar' },
    ],
  },
  {
    title: 'AKSESUAR & TAMAMLAYICI',
    path: '/aksesuar',
    subCategories: [
      { title: 'Saksılıklar', path: '/aksesuar/saksiliklar' },
      { title: 'Aydınlatma (Lambaderler)', path: '/aksesuar/aydinlatma' },
      { title: 'Şamdanlar', path: '/aksesuar/samdanlar' },
    ],
  },
  {
    title: 'YENİ GELENLER',
    path: '/yeni-gelenler',
    subCategories: [], // Alt kategorisi olmayan bir link
  },
  {
    title: 'TÜM ÜRÜNLER',
    path: '/tum-urunler',
    subCategories: [], // Alt kategorisi olmayan bir link
  },
];