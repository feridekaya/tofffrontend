// frontend/src/pages/CorporateSalesPage.js
import React from 'react';
import { FaDraftingCompass, FaChair, FaGift, FaBuilding, FaHandshake, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SERVICES = [
    {
        icon: <FaDraftingCompass size={28} />,
        title: 'Mimari Proje & Çözüm Ortaklığı',
        text: 'Otel, restoran, kafe (HoReCa) ve ofis projeleriniz için mekana özel ölçü ve tasarımda toplu mobilya üretimi.',
    },
    {
        icon: <FaChair size={28} />,
        title: 'Kurumsal Ofis Çözümleri',
        text: 'Şirketinizin kimliğine uygun toplantı masaları, çalışma istasyonları ve yönetici grupları.',
    },
    {
        icon: <FaGift size={28} />,
        title: 'Kurumsal Hediye Seçenekleri',
        text: 'Çalışanlarınız ve iş ortaklarınız için masaüstü düzenleyiciler, metal aksesuarlar veya markanıza özel kalıcı hediyeler.',
    },
    {
        icon: <FaBuilding size={28} />,
        title: 'Markalı Ürün Üretimi',
        text: 'Kurum logonuzun veya kurumsal renklerinizin işlendiği, firmanıza özel metal-ahşap tasarım ürünler.',
    },
];

const WHY = [
    'Mekana özgü ölçü ve tasarım üretimi',
    'Toplu sipariş avantajları ve proje fiyatlandırması',
    'Proje danışmanlığı ve atölye ziyareti imkânı',
    'Hızlı prototip ve numune üretimi',
    'Metal + masif ahşap endüstriyel dayanıklılık',
    'Teslim sonrası teknik destek',
];

export default function CorporateSalesPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 animate-fade-up">

            {/* Hero */}
            <div className="text-center mb-14">
                <p className="text-xs font-bold text-toff-accent tracking-[0.3em] uppercase mb-4">Kurumsal Satış & Proje Ortaklığı</p>
                <h1 className="text-3xl sm:text-5xl font-black text-toff-text mb-5">
                    TOFF | Kurumsal Çözümler
                </h1>
                <p className="text-lg text-toff-accent italic mb-6">
                    "Mekanlarınız, Markanızın En Güçlü İmzasıdır."
                </p>
                <div className="w-12 h-0.5 bg-toff-accent mx-auto mb-8" />
                <p className="text-toff-muted max-w-3xl mx-auto leading-relaxed mb-4">
                    Çalışanlarınızın verimliliğini artıran ofislerden, misafirlerinizi ağırladığınız restoran ve kafelere kadar;
                    mekanların ruhunu tasarımla buluşturuyoruz. <strong className="text-toff-text">Toff Kurumsal Satış</strong> ekibi olarak,
                    metal ve ahşabın endüstriyel zarafetini iş dünyasının profesyonelliğiyle birleştiriyoruz.
                </p>
                <p className="text-toff-muted max-w-3xl mx-auto leading-relaxed">
                    İster tek bir yönetici odası, ister zincir bir restoran projesi olsun; Toff'un zanaatkar dokunuşunu projelerinize taşıyoruz.
                    İhtiyaçlarınız doğrultusunda sizi ofisinizde ziyaret edebilir veya atölyemizde ağırlayabiliriz.
                </p>
            </div>

            {/* Hizmet Kartları */}
            <div className="mb-14">
                <h2 className="text-xl font-bold text-toff-text text-center mb-8">Hizmet Verdiğimiz Alanlar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {SERVICES.map((s, i) => (
                        <div key={i} className="bg-toff-bg-2 border border-toff-border rounded-2xl p-6 text-center hover:border-toff-accent/30 transition-colors">
                            <div className="w-14 h-14 bg-toff-accent/10 text-toff-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                                {s.icon}
                            </div>
                            <h3 className="text-sm font-bold text-toff-text mb-3">{s.title}</h3>
                            <p className="text-xs text-toff-muted leading-relaxed">{s.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Neden TOFF */}
            <div className="bg-toff-bg-2 border border-toff-border rounded-2xl p-8 mb-10">
                <h2 className="text-lg font-bold text-toff-text text-center mb-6">Neden TOFF Kurumsal?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {WHY.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-toff-bg rounded-xl">
                            <span className="text-toff-accent font-bold text-lg shrink-0">›</span>
                            <span className="text-sm text-toff-muted">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-toff-accent/5 border border-toff-accent/20 rounded-2xl p-8 sm:p-10 text-center">
                <div className="flex justify-center mb-5">
                    <div className="w-16 h-16 bg-toff-accent/10 text-toff-accent rounded-2xl flex items-center justify-center">
                        <FaHandshake size={32} />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-toff-text mb-3">Projenizi Birlikte Hayata Geçirelim</h2>
                <p className="text-toff-muted text-sm max-w-xl mx-auto mb-8 leading-relaxed">
                    Toff'un profesyonel kadrosu ve "mekana özgü üretim" yeteneğiyle tanışmadıysanız şimdi tam sırası.
                    Standart mobilyaların ötesinde; uzun ömürlü, karakter sahibi ve markanızı yansıtan çözümler için bizimle iletişime geçin.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="mailto:thetoffdesign@gmail.com"
                        className="flex items-center justify-center gap-2 bg-toff-accent hover:bg-toff-accent-3 text-white font-bold px-7 py-3.5 rounded-xl tracking-wider text-sm transition-colors"
                    >
                        <FaEnvelope size={14} />
                        thetoffdesign@gmail.com
                    </a>
                    <a
                        href="https://wa.me/905424509342"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-900/40 hover:bg-green-800/50 border border-green-700/50 text-green-400 font-bold px-7 py-3.5 rounded-xl tracking-wider text-sm transition-colors"
                    >
                        <FaWhatsapp size={16} />
                        WhatsApp'tan Ulaşın
                    </a>
                </div>

                <p className="text-xs text-toff-faint mt-5">
                    veya{' '}
                    <Link to="/iletisim" className="text-toff-accent hover:underline">
                        İletişim formumuzu
                    </Link>{' '}
                    doldurabilirsiniz.
                </p>
            </div>
        </div>
    );
}
