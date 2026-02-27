// frontend/src/CorporateSalesPage.js
import React from 'react';
// İkonlar için react-icons kullanıyoruz
import { FaBuilding, FaChair, FaGift, FaDraftingCompass, FaHandshake, FaPhoneAlt } from 'react-icons/fa';

function CorporateSalesPage() {
    return (
        <div className="corporate-page-container" style={styles.container}>

            {/* Başlık Bölümü */}
            <div style={styles.headerSection}>
                <h1 style={styles.mainTitle}>TOFF | Kurumsal Satış & Proje Ortaklığı</h1>
                <h2 style={styles.subTitle}>"Mekanlarınız, Markanızın En Güçlü İmzasıdır."</h2>
                <div style={styles.divider}></div>
            </div>

            {/* Giriş Metni */}
            <section style={styles.introSection}>
                <p style={styles.introText}>
                    Çalışanlarınızın verimliliğini artıran ofislerden, misafirlerinizi ağırladığınız restoran ve kafelere kadar;
                    mekanların ruhunu tasarımla buluşturuyoruz. <strong>Toff Kurumsal Satış</strong> ekibi olarak, metal ve ahşabın endüstriyel
                    zarafetini iş dünyasının profesyonelliğiyle birleştiriyor, markanıza değer katmaktan mutluluk duyuyoruz.
                </p>
                <p style={styles.introText}>
                    İster tek bir yönetici odası, ister zincir bir restoran projesi olsun; Toff'un zanaatkar dokunuşunu ve endüstriyel
                    kalitesini projelerinize taşıyoruz. İhtiyaçlarınız doğrultusunda oluşturacağımız proje ve ürün seçeneklerini sunmak için
                    sizi ofisinizde ziyaret edebilir veya atölyemizde ağırlayabiliriz.
                </p>
            </section>

            {/* Hizmetler Grid Yapısı */}
            <h2 style={styles.sectionTitle}>Hizmet Verdiğimiz Alanlar</h2>
            <div style={styles.servicesGrid}>

                {/* Hizmet 1 */}
                <div style={styles.serviceCard}>
                    <div style={styles.iconWrapper}><FaDraftingCompass size={32} color="#C08B5C" /></div>
                    <h3 style={styles.cardTitle}>Mimari Proje & Çözüm Ortaklığı</h3>
                    <p style={styles.cardText}>
                        Otel, restoran, kafe (HoReCa) ve ofis projeleriniz için mekana özel ölçü ve tasarımda toplu mobilya üretimi.
                    </p>
                </div>

                {/* Hizmet 2 */}
                <div style={styles.serviceCard}>
                    <div style={styles.iconWrapper}><FaChair size={32} color="#C08B5C" /></div>
                    <h3 style={styles.cardTitle}>Kurumsal Ofis Çözümleri</h3>
                    <p style={styles.cardText}>
                        Şirketinizin kimliğine uygun toplantı masaları, çalışma istasyonları ve yönetici grupları.
                    </p>
                </div>

                {/* Hizmet 3 */}
                <div style={styles.serviceCard}>
                    <div style={styles.iconWrapper}><FaGift size={32} color="#C08B5C" /></div>
                    <h3 style={styles.cardTitle}>Kurumsal Hediye Seçenekleri</h3>
                    <p style={styles.cardText}>
                        Çalışanlarınız ve iş ortaklarınız için; masaüstü düzenleyiciler, metal aksesuarlar veya markanıza özel tasarlanmış kalıcı hediyeler.
                    </p>
                </div>

                {/* Hizmet 4 */}
                <div style={styles.serviceCard}>
                    <div style={styles.iconWrapper}><FaBuilding size={32} color="#C08B5C" /></div>
                    <h3 style={styles.cardTitle}>Markalı Ürün Üretimi</h3>
                    <p style={styles.cardText}>
                        Kurum logonuzun veya kurumsal renklerinizin işlendiği, firmanıza özel metal-ahşap tasarım ürünler.
                    </p>
                </div>
            </div>

            {/* Alt Bilgi ve İletişim (CTA) */}
            <section style={styles.ctaSection}>
                <div style={styles.ctaContent}>
                    <FaHandshake size={50} color="#C08B5C" style={{ marginBottom: '20px' }} />
                    <p style={styles.ctaText}>
                        Toff'un profesyonel kadrosu ve "mekana özgü üretim" yeteneğiyle tanışmadıysanız şimdi tam sırası.
                        Standart mobilyaların ötesinde; uzun ömürlü, karakter sahibi ve markanızı yansıtan çözümler için bizimle iletişime geçebilirsiniz.
                    </p>
                    <div style={styles.contactBox}>
                        <h3>Projeleriniz için bizimle iletişime geçin:</h3>
                        <p><FaPhoneAlt style={{ marginRight: '10px' }} /> <strong>Toff Kurumsal Satış Direktörü</strong></p>
                        <p>info@thetoff.com | +90 (555) 000 00 00</p>
                        <button style={styles.catalogButton}>Kurumsal Kataloğu İncele</button>
                    </div>
                </div>
            </section>

        </div>
    );
}

// Sayfa Stilleri (CSS-in-JS) - Luxury Dark Mode
const styles = {
    container: {
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', sans-serif",
        color: '#9CA3AF',
        lineHeight: '1.6',
        backgroundColor: 'transparent'
    },
    headerSection: {
        textAlign: 'center',
        marginBottom: '50px',
        paddingBottom: '20px'
    },
    mainTitle: {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#EDEDED',
        marginBottom: '10px'
    },
    subTitle: {
        fontSize: '1.4rem',
        fontWeight: '300',
        color: '#9CA3AF',
        fontStyle: 'italic'
    },
    divider: {
        width: '80px',
        height: '4px',
        backgroundColor: '#C08B5C',
        margin: '20px auto 0'
    },
    introSection: {
        maxWidth: '900px',
        margin: '0 auto 60px',
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#9CA3AF'
    },
    introText: {
        marginBottom: '20px'
    },
    sectionTitle: {
        textAlign: 'center',
        fontSize: '2rem',
        marginBottom: '40px',
        color: '#EDEDED'
    },
    servicesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        marginBottom: '80px'
    },
    serviceCard: {
        backgroundColor: '#242424',
        padding: '30px 20px',
        borderRadius: '10px',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        border: '1px solid #333333',
        cursor: 'default'
    },
    iconWrapper: {
        width: '70px',
        height: '70px',
        backgroundColor: 'transparent',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px'
    },
    cardTitle: {
        fontSize: '1.25rem',
        marginBottom: '15px',
        fontWeight: '600',
        color: '#FFFFFF'
    },
    cardText: {
        fontSize: '0.95rem',
        color: '#9CA3AF'
    },
    ctaSection: {
        backgroundColor: '#242424',
        padding: '50px',
        borderRadius: '15px',
        textAlign: 'center',
        border: '1px solid #333333'
    },
    ctaContent: {
        maxWidth: '800px',
        margin: '0 auto'
    },
    ctaText: {
        fontSize: '1.1rem',
        marginBottom: '30px',
        color: '#9CA3AF'
    },
    contactBox: {
        backgroundColor: '#1F1F1F',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: 'none',
        display: 'inline-block',
        width: '100%',
        maxWidth: '500px',
        border: '1px solid #333333',
        color: '#9CA3AF'
    },
    catalogButton: {
        marginTop: '20px',
        padding: '12px 30px',
        backgroundColor: '#C08B5C',
        color: '#fff',
        border: 'none',
        borderRadius: '25px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.3s'
    }
};

export default CorporateSalesPage;
