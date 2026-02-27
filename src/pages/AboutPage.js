// frontend/src/AboutPage.js
import React from 'react';
// Görsellik katmak için ikonları ekliyoruz
import { FaLayerGroup, FaHammer, FaEye, FaBullseye, FaFingerprint, FaShieldAlt } from 'react-icons/fa';

function AboutPage() {
    return (
        <div className="about-page-container" style={styles.container}>

            {/* Başlık (Hero) Bölümü */}
            <div style={styles.headerSection}>
                <h1 style={styles.mainTitle}>TOFF | Hakkımızda</h1>
                <h2 style={styles.subTitle}>Biz Kimiz?</h2>
                <h3 style={styles.tagline}>"Endüstriyel Zarafet, El İşçiliğiyle Buluşuyor."</h3>
                <div style={styles.divider}></div>
            </div>

            {/* Biz Kimiz? - Hikaye */}
            <section style={styles.storySection}>
                <p style={styles.text}>
                    Toff, metalin soğuk ve güçlü doğasını, usta el işçiliğiyle yaşam alanlarına sıcaklık katan bir forma dönüştürmek için 2024 yılında kuruldu. Hikayemiz, malzemenin sınırlarını zorlamakla başladı: Bazen masif ahşabın doğallığını metalin sağlamlığıyla çerçeveliyoruz; bazen de metali tek başına, yalın ve heykelsi bir tasarım objesi olarak sunuyoruz.
                </p>
                <p style={styles.text}>
                    Toff atölyesinde seri üretim bantları değil, <strong>zanaatkarlık</strong> konuşur. Seri üretimin ruhsuzluğuna karşı, el işçiliğinin ve "dürüst malzeme" kullanımının gücüne inanıyoruz. Her bir parça; kaynak aşamasından boyaya kadar el emeğiyle, detaylara gösterilen özenle şekillenir.
                </p>
                <div style={styles.highlightBox}>
                    <p style={{ margin: 0, fontStyle: 'italic' }}>
                        Kurulduğumuz günden beri felsefemiz net: <strong>"Az, aslında çoktur."</strong> Gereksiz süslemelerden arınmış, fonksiyonel ve estetik açıdan doyurucu tasarımlarımızla, yaşam alanlarınızda sadece bir yer kaplamayı değil, o alanın vazgeçilmez bir parçası olmayı hedefliyoruz.
                    </p>
                </div>
            </section>

            {/* Felsefemiz */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <FaLayerGroup size={30} color="var(--text-primary)" />
                    <h2 style={styles.sectionTitle}>Tasarım ve Üretim Felsefemiz</h2>
                </div>
                <p style={styles.text}>
                    Toff, "Mekana Özgü Tasarım" anlayışını benimser. Bizim için tasarım; bir masanın sadece dört ayak üzerinde durması değil, o masanın mekandaki ışıkla, gölgeyle ve sizin yaşam tarzınızla kurduğu ilişkidir.
                </p>
                <ul style={styles.philosophyList}>
                    <li style={styles.philosophyItem}>
                        <strong>Metalin Gücü, Tasarımın Esnekliği:</strong> İster tamamı metalden oluşan minimalist bir askılık, ister ahşapla metalin dans ettiği bir kitaplık... Metalin dayanıklılığını, tasarımın estetiğiyle birleştiriyoruz.
                    </li>
                    <li style={styles.philosophyItem}>
                        <strong>Evler İçin:</strong> Salonunuzun en özel köşesi için tasarlanmış bir orta sehpa veya banyonuz için şık bir havluluk... Evinize karakter katan parçalar üretiyoruz.
                    </li>
                    <li style={styles.philosophyItem}>
                        <strong>Projeler İçin:</strong> Mimarlar, kafeler, restoranlar ve ofisler için; mekanın kimliğine uygun, toplu üretim kapasitesine sahip, dayanıklı ve estetik çözümler sunuyoruz.
                    </li>
                </ul>
            </section>

            {/* Vizyon & Misyon (Yan Yana Kartlar) */}
            <div style={styles.gridContainer}>
                {/* Vizyon Kartı */}
                <div style={styles.visionCard}>
                    <div style={styles.iconCircle}><FaEye size={30} color="#fff" /></div>
                    <h2 style={styles.cardTitle}>Vizyonumuz</h2>
                    <p style={styles.cardText}>
                        Türkiye'den doğan global bir tasarım markası olarak; yaşam alanlarında "geçici hevesler" yerine "kalıcı değerler" inşa etmek. Endüstriyel tasarım denildiğinde akla gelen ilk marka olmak ve mobilyanın ötesinde, modern ve rafine bir yaşam kültürü oluşturmak.
                    </p>
                </div>

                {/* Misyon Kartı */}
                <div style={styles.missionCard}>
                    <div style={styles.iconCircle}><FaBullseye size={30} color="#fff" /></div>
                    <h2 style={styles.cardTitle}>Misyonumuz</h2>
                    <p style={styles.cardText}>
                        Endüstriyel tasarımı, "soğuk ve uzak" algısından çıkarıp; her renge, her dokuya ve her ölçüye uyum sağlayabilen, ulaşılabilir ve sürdürülebilir bir yaşam stiline dönüştürmek.
                    </p>
                    <ul style={styles.missionList}>
                        <li><strong>Zamansızlık:</strong> Modası geçmeyecek, yıllandıkça değerlenecek tasarımlar.</li>
                        <li><strong>Sürdürülebilirlik:</strong> "Kullan-at" yerine nesilden nesile aktarılacak dayanıklılık.</li>
                        <li><strong>Ulaşılabilir Tasarım:</strong> Kaliteli işçilik ve özgün tasarımı ulaşılabilir bir lüks kılmak.</li>
                    </ul>
                </div>
            </div>

            {/* Değerlerimiz */}
            <section style={styles.valuesSection}>
                <h2 style={{ ...styles.sectionTitle, textAlign: 'center', marginBottom: '40px' }}>Değerlerimiz</h2>
                <div style={styles.valuesGrid}>
                    <div style={styles.valueItem}>
                        <FaHammer size={40} color="var(--accent-color)" style={{ marginBottom: '15px' }} />
                        <h3>Zanaat</h3>
                        <p>%100 El işçiliği ve yerli üretim.</p>
                    </div>
                    <div style={styles.valueItem}>
                        <FaFingerprint size={40} color="var(--accent-color)" style={{ marginBottom: '15px' }} />
                        <h3>Esneklik</h3>
                        <p>Kişiselleştirilebilir ölçü ve renk seçenekleri.</p>
                    </div>
                    <div style={styles.valueItem}>
                        <FaShieldAlt size={40} color="var(--accent-color)" style={{ marginBottom: '15px' }} />
                        <h3>Dayanıklılık</h3>
                        <p>Nesilden nesile aktarılacak kalite.</p>
                    </div>
                </div>
            </section>

        </div>
    );
}

// Styles (CSS-in-JS)
const styles = {
    container: {
        padding: '60px 20px',
        maxWidth: '1100px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', sans-serif",
        color: 'var(--text-secondary)',
        lineHeight: '1.7'
    },
    headerSection: {
        textAlign: 'center',
        marginBottom: '50px'
    },
    mainTitle: {
        fontSize: '2.5rem',
        fontWeight: '800',
        color: 'var(--text-primary)',
        marginBottom: '10px'
    },
    subTitle: {
        fontSize: '1.5rem',
        fontWeight: '300',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '2px'
    },
    tagline: {
        fontSize: '1.2rem',
        fontStyle: 'italic',
        color: 'var(--accent-color)',
        marginTop: '10px'
    },
    divider: {
        width: '60px',
        height: '4px',
        backgroundColor: 'var(--accent-color)',
        margin: '20px auto'
    },
    storySection: {
        marginBottom: '60px',
        fontSize: '1.1rem',
        textAlign: 'justify'
    },
    text: {
        marginBottom: '20px'
    },
    highlightBox: {
        backgroundColor: 'transparent',
        borderLeft: '4px solid var(--accent-color)',
        padding: '20px',
        marginTop: '30px',
        color: 'var(--text-secondary)'
    },
    section: {
        marginBottom: '60px'
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '20px',
        borderBottom: '2px solid var(--border-color)',
        paddingBottom: '10px'
    },
    sectionTitle: {
        fontSize: '1.8rem',
        color: 'var(--text-primary)',
        margin: 0
    },
    philosophyList: {
        listStyle: 'none',
        padding: 0
    },
    philosophyItem: {
        backgroundColor: 'var(--bg-secondary)',
        marginBottom: '10px',
        padding: '15px',
        borderRadius: '8px',
        borderLeft: '4px solid var(--accent-color)'
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        marginBottom: '60px'
    },
    visionCard: {
        backgroundColor: 'var(--bg-secondary)',
        padding: '40px 30px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        border: '1px solid var(--border-color)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
    },
    missionCard: {
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        padding: '40px 30px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        textAlign: 'center',
        position: 'relative',
        border: '1px solid var(--border-color)'
    },
    iconCircle: {
        width: '60px',
        height: '60px',
        backgroundColor: 'var(--accent-color)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px'
    },
    cardTitle: {
        fontSize: '1.5rem',
        marginBottom: '15px',
        fontWeight: '700',
        color: 'var(--text-primary)'
    },
    cardText: {
        fontSize: '1rem',
        marginBottom: '20px',
        color: 'var(--text-secondary)'
    },
    missionList: {
        textAlign: 'left',
        paddingLeft: '20px',
        fontSize: '0.95rem',
        lineHeight: '1.8',
        color: 'var(--text-secondary)'
    },
    valuesSection: {
        backgroundColor: 'var(--bg-secondary)',
        padding: '50px 20px',
        borderRadius: '20px',
        border: '1px solid var(--border-color)'
    },
    valuesGrid: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '30px',
        textAlign: 'center'
    },
    valueItem: {
        flex: '1 1 200px',
        padding: '20px'
    }
};

export default AboutPage;
