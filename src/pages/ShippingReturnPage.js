// frontend/src/pages/ShippingReturnPage.js
import React from 'react';
import { FaTruck, FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa';

const SECTIONS = [
    {
        icon: <FaTruck size={22} className="text-toff-accent" />,
        title: 'Teslimat Süreci',
        items: [
            'Tüm siparişler onaylandıktan sonra 2–4 hafta içinde üretilip kargoya verilir.',
            'Kargo takip numarası, ürün kargoya verildikten sonra e-posta ve SMS ile iletilir.',
            'Teslimat, yalnızca Türkiye genelinde yapılmaktadır.',
            'Teslimat süreci kargo firmasına bağlı olarak değişebilir; mücbir sebeplerde (doğal afet, grev vb.) gecikmeler yaşanabilir.',
            'Büyük ve ağır ürünlerde (150 cm üzeri / 50 kg üzeri) özel nakliye ekibi devreye girer; teslimat öncesinde müşteriyle randevu alınır.',
        ],
    },
    {
        icon: null,
        title: 'Kargo Ücreti',
        items: [
            'Belirtilen koşullarda teslimatlarda kargo ücreti alıcıya / firmamıza aittir.',
            'İade kargo bedeli alıcıya / firmamıza aittir.',
        ],
    },
    {
        icon: <FaBoxOpen size={22} className="text-toff-accent" />,
        title: 'İade Koşulları',
        items: [
            'Ürün teslim alındıktan sonra 14 gün içinde iade talebinde bulunabilirsiniz.',
            'İade edilecek ürünün orijinal ambalajında, hasarsız ve kullanılmamış olması gerekmektedir.',
            'TOFF, özel ölçü veya kişiselleştirilmiş siparişlerde iade kabul etmez.',
            'Ürün hasarı veya eksikliği teslimat anında tutanakla belgelenmeli; kargo görevlisi yanındayken tespit edilmelidir.',
            'Hasarlı ürünler için fotoğraflı belgeleme ve kargo teslimat tutanağı gereklidir.',
        ],
    },
    {
        icon: <FaExclamationTriangle size={22} className="text-toff-accent" />,
        title: 'İade Edilemeyen Ürünler',
        items: [
            'Özel ölçü/renk/materyal seçimiyle üretilen kişiselleştirilmiş ürünler iade edilemez.',
            'Montajı tamamlanmış veya kullanılmış ürünler iade kapsamı dışındadır.',
            'Hijyen ve güvenlik gerekçesiyle belirli ürün kategorileri iade kabul etmeyebilir.',
        ],
    },
];

function ShippingReturnPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 animate-fade-up">

            {/* Başlık */}
            <div className="text-center mb-12">
                <p className="text-xs font-bold text-toff-accent tracking-[0.3em] uppercase mb-3">Politikamız</p>
                <h1 className="text-3xl font-black text-toff-text mb-3">Teslimat & İade Politikası</h1>
                <div className="w-12 h-0.5 bg-toff-accent mx-auto" />
            </div>

            {/* Bölümler */}
            <div className="flex flex-col gap-6">
                {SECTIONS.map((sec, i) => (
                    <div key={i} className="bg-toff-bg-2 border border-toff-border rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-5">
                            {sec.icon}
                            <h2 className="text-base font-bold text-toff-text tracking-wide">{sec.title}</h2>
                        </div>
                        <ul className="flex flex-col gap-3">
                            {sec.items.map((item, j) => (
                                <li key={j} className="flex gap-3 text-sm text-toff-muted leading-relaxed">
                                    <span className="text-toff-accent shrink-0 mt-0.5">›</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* İletişim notu */}
                <div className="bg-toff-accent/5 border border-toff-accent/20 rounded-2xl p-6 text-center">
                    <p className="text-sm text-toff-muted">
                        İade ve teslimat konularında destek için:{' '}
                        <a href="mailto:thetoffdesign@gmail.com" className="text-toff-accent hover:underline font-medium">
                            thetoffdesign@gmail.com
                        </a>{' '}
                        veya{' '}
                        <a href="https://wa.me/905424509342" target="_blank" rel="noopener noreferrer" className="text-toff-accent hover:underline font-medium">
                            WhatsApp Hattımız
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ShippingReturnPage;
