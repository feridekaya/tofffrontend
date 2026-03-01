// frontend/src/pages/ToffPromisePage.js
import React from 'react';
import { FaInfinity, FaLeaf, FaHammer, FaGlobeEurope, FaRecycle } from 'react-icons/fa';

const PROMISES = [
    {
        icon: <FaInfinity size={32} className="text-toff-accent" />,
        title: '1. Yavaş Tüketim, Uzun Ömür',
        subtitle: 'Longevity',
        text: 'En çevreci ürün, bir kez alınıp ömür boyu kullanılan üründür. Toff mobilyaları, birkaç yıl içinde deforme olup çöpe gitmek üzere değil, sizinle birlikte yaşlanmak üzere tasarlanır. Metalin sonsuz dayanıklılığını ve masif ahşabın onarılabilir yapısını kullanarak, atık üretimini kaynağında engelliyoruz. Bizim için kalite, sürdürülebilirliğin en somut kanıtıdır.',
    },
    {
        icon: <FaLeaf size={32} className="text-toff-accent" />,
        title: '2. Dürüst ve Geri Dönüştürülebilir Malzeme',
        subtitle: null,
        bullets: [
            { label: 'Metal:', text: 'Ürünlerimizin iskeletini oluşturan metal, %100 geri dönüştürülebilir bir materyaldir. Endüstriyel döngüde değerini asla kaybetmez.' },
            { label: 'Masif Ahşap:', text: 'Sunta veya yonga levha gibi kimyasal yapıştırıcılarla preslenmiş malzemeler yerine; nefes alan, doğal ve sürdürülebilir orman yönetimi ilkelerine uygun masif ahşap kullanıyoruz.' },
        ],
        intro: 'Doğadan aldığımızı, doğaya zarar vermeden işliyoruz.',
    },
    {
        icon: <FaHammer size={32} className="text-toff-accent" />,
        title: '3. Onarılabilir Tasarım',
        subtitle: 'Repairability',
        text: 'Gerçek sürdürülebilirlik, bir ürünün ömrünü uzatabilmektir. Endüstriyel ürünlerimiz modüler ve yenilenebilir yapıdadır. Masif ahşap bir masanız yıllar sonra çizilirse zımparalanıp ilk günkü haline dönebilir. Metal aksamlar rengini değiştirmek istediğinizde yeniden boyanabilir. Bizim ürünlerimiz "çöp" olmaz, sadece "kabuk değiştirir".',
    },
    {
        icon: <FaGlobeEurope size={32} className="text-toff-accent" />,
        title: '4. Yerel Üretim, Düşük Karbon Ayak İzi',
        subtitle: null,
        text: 'Üretimimizin tamamını yerel atölyelerimizde, yerli zanaatkarlarımızla gerçekleştiriyoruz. İthal mobilyaların yarattığı kıtalararası lojistik kirliliğini ortadan kaldırıyor, yerel ekonomiyi desteklerken karbon ayak izimizi minimumda tutuyoruz.',
    },
    {
        icon: <FaRecycle size={32} className="text-toff-accent" />,
        title: '5. Atıksız Üretim Hedefi',
        subtitle: null,
        text: 'Atölyemizde hiçbir parça ziyan edilmez. Büyük bir masadan artan ahşap parçalar, şık bir şamdana veya duvar rafına dönüşür. Metal fireleri, küçük aksesuarlarda hayat bulur. Kaynakları son milimine kadar değerlendirmek, zanaatkarlığımızın bir parçasıdır.',
    },
];

function ToffPromisePage() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 animate-fade-up">

            {/* Başlık */}
            <div className="text-center mb-14 border-b border-toff-border pb-10">
                <p className="text-xs font-bold text-toff-accent tracking-[0.35em] uppercase mb-4">
                    Sürdürülebilirlik Manifestosu
                </p>
                <h1 className="text-3xl sm:text-5xl font-black text-toff-text mb-6">
                    TOFF | Gelecek İçin Tasarım
                </h1>
                <p className="text-lg sm:text-xl text-toff-accent italic font-medium max-w-2xl mx-auto leading-relaxed">
                    "Dünya Bizim Evimiz. Onu Tıpkı Ürünlerimiz Gibi, 'Kalıcı' Kılmak İstiyoruz."
                </p>
            </div>

            {/* Giriş */}
            <div className="text-center max-w-3xl mx-auto mb-14">
                <p className="text-toff-muted leading-relaxed mb-3">
                    Toff olarak, tasarımın sadece estetik bir kaygı değil, aynı zamanda etik bir duruş olduğuna inanıyoruz.
                    Biz de daha iyi bir gelecek için sorumluluk alıyoruz. Tüketim çılgınlığının ve "kullan-at" kültürünün
                    hakim olduğu bir çağda, biz yıllara meydan okuyan, nesilden nesile aktarılabilen mobilyalar üreterek
                    doğaya saygımızı gösteriyoruz.
                </p>
                <p className="text-toff-muted leading-relaxed">
                    Sürdürülebilirlik bizim için bir trend değil, üretimimizin temel taşıdır. İşte Toff'un dünyaya ve geleceğe verdiği sözler:
                </p>
            </div>

            {/* 5 Söz */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {PROMISES.map((p, i) => (
                    <div
                        key={i}
                        className={`bg-toff-bg-2 border border-toff-border rounded-2xl p-7 hover:border-toff-accent/30 transition-colors
              ${i === 4 ? 'sm:col-span-2' : ''}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 w-12 h-12 bg-toff-accent/10 rounded-xl flex items-center justify-center">
                                {p.icon}
                            </div>
                            <div className="flex-1">
                                <div className="mb-2">
                                    <h3 className="text-base font-bold text-toff-text">{p.title}</h3>
                                    {p.subtitle && (
                                        <span className="text-xs text-toff-accent tracking-wider italic">{p.subtitle}</span>
                                    )}
                                </div>
                                {p.intro && <p className="text-sm text-toff-muted italic mb-3">{p.intro}</p>}
                                {p.text && <p className="text-sm text-toff-muted leading-relaxed">{p.text}</p>}
                                {p.bullets && (
                                    <ul className="flex flex-col gap-2">
                                        {p.bullets.map((b, j) => (
                                            <li key={j} className="text-sm text-toff-muted leading-relaxed">
                                                <span className="font-bold text-toff-text">{b.label}</span> {b.text}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Kapanış Sözü */}
            <div className="bg-toff-accent/5 border border-toff-accent/20 rounded-2xl p-8 text-center">
                <p className="text-toff-accent font-bold text-lg italic mb-3">
                    "Güzellik geçicidir, ama karakter kalıcıdır."
                </p>
                <p className="text-sm text-toff-muted max-w-2xl mx-auto leading-relaxed">
                    Toff olarak, gezegenimize yük olan değil, yaşam alanlarına değer katan ürünler tasarlamaya devam edeceğimize söz veriyoruz.
                </p>
            </div>
        </div>
    );
}

export default ToffPromisePage;
