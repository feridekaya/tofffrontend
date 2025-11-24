// frontend/src/ToffPromisePage.js
import React from 'react';
import { FaLeaf, FaRecycle, FaHammer, FaGlobeEurope, FaInfinity } from 'react-icons/fa'; // İkonlar için

function ToffPromisePage() {
    return (
        <div className="toff-promise-container" style={styles.container}>
            {/* Başlık Bölümü */}
            <div style={styles.headerSection}>
                <h1 style={styles.mainTitle}>TOFF | Gelecek İçin Tasarım</h1>
                <h2 style={styles.subTitle}>SÜRDÜRÜLEBİLİRLİK MANİFESTOSU</h2>
                <h3 style={styles.tagline}>"Dünya Bizim Evimiz. Onu Tıpkı Ürünlerimiz Gibi, 'Kalıcı' Kılmak İstiyoruz."</h3>
            </div>

            {/* Giriş Metni */}
            <section style={styles.introSection}>
                <p style={styles.introText}>
                    Toff olarak, tasarımın sadece estetik bir kaygı değil, aynı zamanda etik bir duruş olduğuna inanıyoruz.
                    Tüketim çılgınlığının ve "kullan-at" kültürünün hakim olduğu bir çağda, biz yıllara meydan okuyan,
                    nesilden nesile aktarılabilen mobilyalar üreterek doğaya saygımızı gösteriyoruz.
                </p>
                <p style={styles.introText}>
                    Sürdürülebilirlik bizim için bir trend değil, üretimimizin temel taşıdır. İşte Toff'un dünyaya ve geleceğe verdiği sözler:
                </p>
            </section>

            {/* 5 Madde - Grid Yapısı */}
            <div style={styles.promisesGrid}>

                {/* Madde 1 */}
                <div style={styles.promiseCard}>
                    <div style={styles.iconWrapper}><FaInfinity size={40} color="#C08B5C" /></div>
                    <h3 style={styles.cardTitle}>1. Yavaş Tüketim, Uzun Ömür</h3>
                    <p style={styles.cardText}>
                        En çevreci ürün, bir kez alınıp ömür boyu kullanılan üründür. Toff mobilyaları, birkaç yıl içinde deforme olup çöpe gitmek üzere değil, sizinle birlikte yaşlanmak üzere tasarlanır. Metalin sonsuz dayanıklılığıyla atık üretimini kaynağında engelliyoruz.
                    </p>
                </div>

                {/* Madde 2 */}
                <div style={styles.promiseCard}>
                    <div style={styles.iconWrapper}><FaLeaf size={40} color="#C08B5C" /></div>
                    <h3 style={styles.cardTitle}>2. Dürüst Malzeme</h3>
                    <p style={styles.cardText}>
                        <strong>Metal:</strong> %100 geri dönüştürülebilir, endüstriyel döngüde değerini kaybetmeyen iskeletimiz.<br />
                        <strong>Masif Ahşap:</strong> Kimyasal yapıştırıcılarla preslenmiş sunta yerine; nefes alan, doğal ve sürdürülebilir masif ahşap.
                    </p>
                </div>

                {/* Madde 3 */}
                <div style={styles.promiseCard}>
                    <div style={styles.iconWrapper}><FaHammer size={40} color="#C08B5C" /></div>
                    <h3 style={styles.cardTitle}>3. Onarılabilir Tasarım</h3>
                    <p style={styles.cardText}>
                        Ürünlerimiz "çöp" olmaz, sadece "kabuk değiştirir". Modüler yapımız sayesinde masif ahşap yıllar sonra zımparalanıp yenilenebilir, metal aksamlar yeniden boyanabilir. Gerçek sürdürülebilirlik, ömrü uzatmaktır.
                    </p>
                </div>

                {/* Madde 4 */}
                <div style={styles.promiseCard}>
                    <div style={styles.iconWrapper}><FaGlobeEurope size={40} color="#C08B5C" /></div>
                    <h3 style={styles.cardTitle}>4. Yerel Üretim & Düşük Karbon</h3>
                    <p style={styles.cardText}>
                        Üretimimizin tamamı yerel atölyelerimizde, yerli zanaatkarlarımızla gerçekleşir. İthal mobilyaların yarattığı lojistik kirliliğini ortadan kaldırıyor, karbon ayak izimizi minimumda tutuyoruz.
                    </p>
                </div>

                {/* Madde 5 */}
                <div style={styles.promiseCard}>
                    <div style={styles.iconWrapper}><FaRecycle size={40} color="#C08B5C" /></div>
                    <h3 style={styles.cardTitle}>5. Atıksız Üretim Hedefi</h3>
                    <p style={styles.cardText}>
                        Atölyemizde hiçbir parça ziyan edilmez. Masadan artan ahşaplar şamdana, metal fireleri küçük aksesuarlara dönüşür. Kaynakları son kırıntısına kadar değerlendiriyoruz.
                    </p>
                </div>

            </div>
        </div>
    );
}

// Sayfa Stilleri - Dark Luxury Mode with Eco-Conscious Feel
const styles = {
    container: {
        padding: '80px 20px',
        maxWidth: '1100px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#9CA3AF',
        lineHeight: '1.6',
        backgroundColor: 'transparent'
    },
    headerSection: {
        textAlign: 'center',
        marginBottom: '60px',
        borderBottom: '1px solid #333333',
        paddingBottom: '40px'
    },
    mainTitle: {
        fontSize: '2.5rem',
        fontWeight: '800',
        color: '#EDEDED',
        marginBottom: '10px',
        letterSpacing: '1px'
    },
    subTitle: {
        fontSize: '1.5rem',
        color: '#9CA3AF',
        marginBottom: '20px',
        fontWeight: '300',
        textTransform: 'uppercase',
        letterSpacing: '0.15em'
    },
    tagline: {
        fontSize: '1.4rem',
        fontStyle: 'italic',
        color: '#C08B5C',
        fontWeight: '500',
        maxWidth: '800px',
        margin: '0 auto',
        lineHeight: '1.6'
    },
    introSection: {
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto 60px auto',
        fontSize: '1.1rem',
        color: '#9CA3AF'
    },
    introText: {
        marginBottom: '20px'
    },
    promisesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        padding: '20px 0'
    },
    promiseCard: {
        backgroundColor: '#242424',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: 'none',
        transition: 'transform 0.3s ease',
        border: '1px solid #333333',
        textAlign: 'center'
    },
    iconWrapper: {
        marginBottom: '20px',
        display: 'inline-block',
        padding: '15px',
        backgroundColor: 'transparent',
        borderRadius: '50%',
        boxShadow: 'none'
    },
    cardTitle: {
        fontSize: '1.3rem',
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: '15px'
    },
    cardText: {
        fontSize: '1rem',
        color: '#9CA3AF',
        lineHeight: '1.7'
    }
};

export default ToffPromisePage;