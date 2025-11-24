// frontend/src/ContactPage.js
import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaLinkedin } from 'react-icons/fa';

function ContactPage() {
    return (
        <div className="contact-page-container" style={styles.container}>

            {/* Başlık */}
            <div style={styles.headerSection}>
                <h1 style={styles.mainTitle}>Bize Ulaşın</h1>
                <h2 style={styles.subTitle}>Size Nasıl Yardımcı Olabiliriz?</h2>
                <div style={styles.divider}></div>
            </div>

            <div style={styles.contentGrid}>

                {/* Sol Taraf: İletişim Bilgileri */}
                <div style={styles.infoColumn}>
                    <h3 style={styles.columnTitle}>İletişim Bilgileri</h3>
                    <p style={styles.columnText}>
                        Sorularınız, önerileriniz veya iş birlikleri için bize aşağıdaki kanallardan ulaşabilirsiniz.
                        Ekibimiz en kısa sürede size dönüş yapacaktır.
                    </p>

                    <div style={styles.contactItem}>
                        <div style={styles.iconBox}><FaPhoneAlt /></div>
                        <div>
                            <h4 style={styles.itemTitle}>Telefon</h4>
                            <p style={styles.itemText}>+90 (212) 000 00 00</p>
                            <p style={styles.itemSubText}>Hafta içi: 09:00 - 18:00</p>
                        </div>
                    </div>

                    <div style={styles.contactItem}>
                        <div style={styles.iconBox}><FaWhatsapp /></div>
                        <div>
                            <h4 style={styles.itemTitle}>WhatsApp Hattı</h4>
                            <p style={styles.itemText}>+90 (555) 000 00 00</p>
                            <p style={styles.itemSubText}>7/24 Mesaj bırakabilirsiniz</p>
                        </div>
                    </div>

                    <div style={styles.contactItem}>
                        <div style={styles.iconBox}><FaEnvelope /></div>
                        <div>
                            <h4 style={styles.itemTitle}>E-Posta</h4>
                            <p style={styles.itemText}>info@thetoff.com</p>
                            <p style={styles.itemText}>satis@thetoff.com</p>
                        </div>
                    </div>

                    <div style={styles.contactItem}>
                        <div style={styles.iconBox}><FaMapMarkerAlt /></div>
                        <div>
                            <h4 style={styles.itemTitle}>Adres</h4>
                            <p style={styles.itemText}>
                                Toff Design Studio<br />
                                Maslak Mah. Büyükdere Cad. No:123<br />
                                Sarıyer / İstanbul
                            </p>
                        </div>
                    </div>

                    {/* Sosyal Medya */}
                    <div style={styles.socialMedia}>
                        <h4 style={styles.itemTitle}>Bizi Takip Edin</h4>
                        <div style={styles.socialIcons}>
                            <a href="#" style={styles.socialLink}><FaInstagram /></a>
                            <a href="#" style={styles.socialLink}><FaLinkedin /></a>
                        </div>
                    </div>
                </div>

                {/* Sağ Taraf: İletişim Formu */}
                <div style={styles.formColumn}>
                    <h3 style={styles.columnTitle}>Mesaj Gönderin</h3>
                    <form style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Adınız Soyadınız</label>
                            <input type="text" style={styles.input} placeholder="Adınız Soyadınız" />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>E-Posta Adresiniz</label>
                            <input type="email" style={styles.input} placeholder="ornek@email.com" />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Konu</label>
                            <select style={styles.select}>
                                <option>Genel Bilgi</option>
                                <option>Sipariş Durumu</option>
                                <option>İade / Değişim</option>
                                <option>Kurumsal Satış</option>
                                <option>Diğer</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Mesajınız</label>
                            <textarea style={styles.textarea} rows="5" placeholder="Mesajınızı buraya yazınız..."></textarea>
                        </div>

                        <button type="button" style={styles.submitButton}>GÖNDER</button>
                    </form>
                </div>

            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', sans-serif",
        color: 'var(--text-secondary)',
    },
    headerSection: {
        textAlign: 'center',
        marginBottom: '60px'
    },
    mainTitle: {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '10px'
    },
    subTitle: {
        fontSize: '1.3rem',
        fontWeight: '300',
        color: 'var(--text-secondary)'
    },
    divider: {
        width: '60px',
        height: '4px',
        backgroundColor: 'var(--accent-color)',
        margin: '20px auto'
    },
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '60px',
    },
    infoColumn: {
        paddingRight: '20px'
    },
    columnTitle: {
        fontSize: '1.5rem',
        color: 'var(--text-primary)',
        marginBottom: '20px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '10px'
    },
    columnText: {
        marginBottom: '30px',
        color: 'var(--text-secondary)',
        lineHeight: '1.6'
    },
    contactItem: {
        display: 'flex',
        gap: '20px',
        marginBottom: '30px'
    },
    iconBox: {
        width: '50px',
        height: '50px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: 'var(--accent-color)',
        flexShrink: 0
    },
    itemTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        marginBottom: '5px',
        color: 'var(--text-primary)'
    },
    itemText: {
        color: 'var(--text-secondary)',
        margin: 0,
        lineHeight: '1.5'
    },
    itemSubText: {
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        marginTop: '3px'
    },
    socialMedia: {
        marginTop: '40px'
    },
    socialIcons: {
        display: 'flex',
        gap: '15px',
        marginTop: '15px'
    },
    socialLink: {
        width: '40px',
        height: '40px',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        transition: 'background 0.3s',
        border: '1px solid var(--border-color)'
    },
    formColumn: {
        backgroundColor: 'var(--bg-secondary)',
        padding: '40px',
        borderRadius: '15px',
        border: '1px solid var(--border-color)'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontWeight: '600',
        fontSize: '0.95rem',
        color: 'var(--text-primary)'
    },
    input: {
        padding: '12px',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        fontSize: '1rem',
        outline: 'none',
        backgroundColor: '#1F1F1F',
        color: 'var(--text-primary)'
    },
    select: {
        padding: '12px',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        fontSize: '1rem',
        outline: 'none',
        backgroundColor: '#1F1F1F',
        color: 'var(--text-primary)'
    },
    textarea: {
        padding: '12px',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        fontSize: '1rem',
        outline: 'none',
        resize: 'vertical',
        backgroundColor: '#1F1F1F',
        color: 'var(--text-primary)'
    },
    submitButton: {
        padding: '15px',
        backgroundColor: 'transparent',
        color: 'var(--text-primary)',
        border: '1px solid var(--text-primary)',
        borderRadius: '6px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.3s',
        marginTop: '10px'
    }
};

export default ContactPage;
