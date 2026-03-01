// frontend/src/pages/ToffPromisePage.js
import React from 'react';
import { FaLeaf, FaRecycle, FaHammer, FaGlobeEurope, FaInfinity } from 'react-icons/fa';

const PROMISES = [
    {
        icon: <FaInfinity size={34} className="text-toff-accent" />,
        title: '1. Yavaş Tüketim, Uzun Ömür',
        text: 'En çevreci ürün, bir kez alınıp ömür boyu kullanılan üründür. Toff mobilyaları, birkaç yıl içinde deforme olup çöpe gitmek üzere değil, sizinle birlikte yaşlanmak üzere tasarlanır. Metalin sonsuz dayanıklılığıyla atık üretimini kaynağında engelliyoruz.',
    },
    {
        icon: <FaLeaf size={34} className="text-toff-accent" />,
        title: '2. Dürüst Malzeme',
        text: 'Metal: %100 geri dönüştürülebilir, endüstriyel döngüde değerini kaybetmeyen iskeletimiz. Masif Ahşap: Kimyasal yapıştırıcılarla preslenmiş sunta yerine; nefes alan, doğal ve sürdürülebilir masif ahşap.',
    },
    {
        icon: <FaHammer size={34} className="text-toff-accent" />,
        title: '3. Onarılabilir Tasarım',
        text: 'Ürünlerimiz "çöp" olmaz, sadece "kabuk değiştirir". Modüler yapımız sayesinde masif ahşap yıllar sonra zımparalanıp yenilenebilir, metal aksamlar yeniden boyanabilir. Gerçek sürdürülebilirlik, ömrü uzatmaktır.',
    },
    {
        icon: <FaGlobeEurope size={34} className="text-toff-accent" />,
        title: '4. Yerel Üretim & Düşük Karbon',
        text: 'Üretimimizin tamamı yerel atölyelerimizde, yerli zanaatkarlarımızla gerçekleşir. İthal mobilyaların yarattığı lojistik kirliliğini ortadan kaldırıyor, karbon ayak izimizi minimumda tutuyoruz.',
    },
    {
        icon: <FaRecycle size={34} className="text-toff-accent" />,
        title: '5. Atıksız Üretim Hedefi',
        text: 'Atölyemizde hiçbir parça ziyan edilmez. Masadan artan ahşaplar şamdana, metal fireleri küçük aksesuarlara dönüşür. Kaynakları son kırıntısına kadar değerlendiriyoruz.',
    },
];

function ToffPromisePage() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 animate-fade-up">

            {/* Başlık */}
            <div className="text-center mb-14 border-b border-toff-border pb-10">
                <p className="text-xs font-bold text-toff-accent tracking-[0.35em] uppercase mb-4">Sürdürülebilirlik Manifestosu</p>
                <h1 className="text-3xl sm:text-5xl font-black text-toff-text mb-6">TOFF | Gelecek İçin Tasarım</h1>
                <p className="text-lg sm:text-xl text-toff-accent italic font-medium max-w-2xl mx-auto leading-relaxed">
                    "Dünya Bizim Evimiz. Onu Tıpkı Ürünlerimiz Gibi, 'Kalıcı' Kılmak İstiyoruz."
                </p>
            </div>

            {/* Giriş */}
            <div className="text-center max-w-3xl mx-auto mb-14">
                <p className="text-toff-muted leading-relaxed mb-4">
                    Toff olarak, tasarımın sadece estetik bir kaygı değil, aynı zamanda etik bir duruş olduğuna inanıyoruz.
                    Tüketim çılgınlığının ve "kullan-at" kültürünün hakim olduğu bir çağda, biz yıllara meydan okuyan,
                    nesilden nesile aktarılabilen mobilyalar üreterek doğaya saygımızı gösteriyoruz.
                </p>
                <p className="text-toff-muted leading-relaxed">
                    Sürdürülebilirlik bizim için bir trend değil, üretimimizin temel taşıdır. İşte Toff'un dünyaya ve geleceğe verdiği sözler:
                </p>
            </div>

            {/* Vaatler Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
                {PROMISES.map((p, i) => (
                    <div key={i} className="bg-toff-bg-2 border border-toff-border rounded-2xl p-7 text-center hover:border-toff-accent/30 transition-colors">
                        <div className="flex justify-center mb-4">{p.icon}</div>
                        <h3 className="text-base font-bold text-toff-text mb-3">{p.title}</h3>
                        <p className="text-sm text-toff-muted leading-relaxed">{p.text}</p>
                    </div>
                ))}
                {/* Kapanış kartı */}
                <div className="bg-toff-accent/5 border border-toff-accent/20 rounded-2xl p-7 text-center sm:col-span-2 lg:col-span-3 lg:col-start-1">
                    <p className="text-toff-accent font-bold text-lg mb-2">Söz veriyoruz.</p>
                    <p className="text-toff-muted text-sm leading-relaxed max-w-2xl mx-auto">
                        Üst üste bükülen trendleri değil, ömür boyu yanınızda duracak mobilyaları tasarlamaya devam edeceğimize söz veriyoruz.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ToffPromisePage;
