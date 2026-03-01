// frontend/src/pages/InfoSocietyPage.js
import React from 'react';

const INFO = [
    { label: 'Ticaret Unvanı', value: 'TOFF Design' },
    { label: 'Yetkili', value: 'Osman DEMİRBAŞ / Furkan ÖZCAN' },
    { label: 'Adres', value: 'Maslak Mah. Büyükdere Cad. No:123, Sarıyer / İstanbul' },
    { label: 'E-Posta', value: 'thetoffdesign@gmail.com', href: 'mailto:thetoffdesign@gmail.com' },
    { label: 'Telefon', value: '+90 542 450 93 42', href: 'tel:+905424509342' },
    { label: 'WhatsApp', value: '+90 542 450 93 42', href: 'https://wa.me/905424509342' },
    { label: 'Vergi Dairesi / No', value: 'İstanbul Vergi Dairesi / —' },
    { label: 'Ticaret Sicil No', value: '—' },
    { label: 'MERSIS No', value: '—' },
];

const SERVICES = [
    {
        title: 'Sipariş ve Satış İşlemleri',
        text: 'Müşteriler, web sitesi üzerinden ürün seçimi, sepete ekleme ve güvenli ödeme işlemlerini gerçekleştirebilir. Siparişler sistem üzerinden takip edilebilir.',
    },
    {
        title: 'Üyelik ve Hesap Yönetimi',
        text: 'Kullanıcılar adres bilgilerini kaydedebilir, sipariş geçmişini görüntüleyebilir, favori ürünlerini listeleyebilir ve şifre güncellemesi yapabilir.',
    },
    {
        title: 'İletişim ve Destek',
        text: 'İletişim formu aracılığıyla müşteri sorularına yanıt verilir. WhatsApp hattı ve e-posta üzerinden de destek sağlanır.',
    },
    {
        title: 'Bilgi Güvenliği',
        text: 'Kullanıcı verileri 6698 sayılı KVKK kapsamında işlenir ve korunur. Kişisel veriler üçüncü taraflarla paylaşılmaz.',
    },
    {
        title: 'Elektronik İletişim',
        text: 'Üyeler, sipariş bildirimleri ve kampanya e-postaları alma konusunda tercihlerini hesap ayarlarından yönetebilir.',
    },
];

function InfoSocietyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 animate-fade-up">

            <div className="text-center mb-12">
                <p className="text-xs font-bold text-toff-accent tracking-[0.3em] uppercase mb-3">Yasal Bilgiler</p>
                <h1 className="text-3xl font-black text-toff-text mb-3">Bilgi Toplumu Hizmetleri & Şirket Bilgileri</h1>
                <div className="w-12 h-0.5 bg-toff-accent mx-auto" />
            </div>

            {/* Şirket Bilgileri */}
            <div className="bg-toff-bg-2 border border-toff-border rounded-2xl p-6 sm:p-8 mb-6">
                <h2 className="text-sm font-bold text-toff-text tracking-widest uppercase mb-5">Şirket Bilgileri</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {INFO.map((item, i) => (
                        <div key={i} className="border-b border-toff-border/40 pb-3">
                            <p className="text-[11px] font-bold text-toff-faint uppercase tracking-widest mb-1">{item.label}</p>
                            {item.href ? (
                                <a href={item.href} className="text-sm text-toff-accent hover:underline font-medium">{item.value}</a>
                            ) : (
                                <p className="text-sm text-toff-muted">{item.value}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Sunulan Hizmetler */}
            <div className="bg-toff-bg-2 border border-toff-border rounded-2xl p-6 sm:p-8">
                <h2 className="text-sm font-bold text-toff-text tracking-widest uppercase mb-5">Sunulan Bilgi Toplumu Hizmetleri</h2>
                <div className="flex flex-col gap-4">
                    {SERVICES.map((s, i) => (
                        <div key={i} className="border-l-2 border-toff-accent/40 pl-4">
                            <h3 className="text-sm font-bold text-toff-text mb-1">{s.title}</h3>
                            <p className="text-sm text-toff-muted leading-relaxed">{s.text}</p>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-toff-faint mt-6 border-t border-toff-border pt-4">
                    Bu sayfa, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve ilgili mevzuat çerçevesinde hazırlanmıştır.
                </p>
            </div>
        </div>
    );
}

export default InfoSocietyPage;
