import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from 'react-icons/fa';

function FAQPage() {
    const [activeId, setActiveId] = useState(null);

    const toggleAccordion = (id) => {
        setActiveId(activeId === id ? null : id);
    };

    const faqCategories = [
        {
            title: "1. Ürünler ve Malzeme Kalitesi",
            items: [
                {
                    question: "Ürünlerinizde hangi malzemeleri kullanıyorsunuz?",
                    answer: "Toff tasarımlarında doğallık ve dayanıklılık önceliğimizdir. Ahşap kısımlarda sunta veya MDF yerine, fırınlanmış masif ahşap (ceviz, meşe, ladin vb.) kullanıyoruz. Metal aksamlarda ise yüksek mukavemetli demir profiller tercih ediyoruz."
                },
                {
                    question: "Metal kısımlar paslanma yapar mı?",
                    answer: "Hayır. Tüm metal ürünlerimiz, paslanmaya ve çizilmelere karşı ekstra dayanıklılık sağlayan elektrostatik fırın boya ile boyanmaktadır. Bu sayede ürünlerinizi uzun yıllar ilk günkü formunda kullanabilirsiniz."
                },
                {
                    question: "Ürünlerin bakımı ve temizliği nasıl yapılmalı?",
                    answer: "Mobilyalarınızı temizlemek için hafif nemli bir bez kullanmanız yeterlidir. Ağartıcı içeren kimyasal temizleyicilerden ve sert yüzeyli süngerlerden kaçınmanızı öneririz. Ahşap yüzeylerin canlılığını koruması için yılda bir kez ahşap koruyucu yağ uygulayabilirsiniz."
                }
            ]
        },
        {
            title: "2. Özel Üretim ve Kişiselleştirme",
            items: [
                {
                    question: "Beğendiğim bir ürünün ölçülerini değiştirebilir miyim?",
                    answer: "Kesinlikle! Toff olarak \"mekana özgü tasarım\" anlayışını benimsiyoruz. Beğendiğiniz modelin en, boy veya yükseklik ölçülerini evinizin/ofisinizin ihtiyacına göre revize edebiliriz. Özel ölçü talepleriniz için bizimle iletişime geçmeniz yeterli."
                },
                {
                    question: "Metal veya ahşap rengini seçme şansım var mı?",
                    answer: "Evet. Metal aksamlar için RAL renk kartelasından dilediğiniz rengi (siyah, beyaz, antrasit, gold vb.) seçebilirsiniz. Ahşap kısımlar için de farklı vernik ve renk tonu seçeneklerimiz mevcuttur."
                },
                {
                    question: "Tamamen bana özel bir tasarım (Custom Design) yapıyor musunuz?",
                    answer: "Evet. Aklınızdaki bir tasarımı veya bir çizimi bizimle paylaşırsanız, Toff atölyesinin imkanları ve endüstriyel çizgimiz dahilinde sizin için hayata geçirebiliriz."
                }
            ]
        },
        {
            title: "3. Sipariş, Teslimat ve Kurulum",
            items: [
                {
                    question: "Teslimat süresi ne kadar?",
                    answer: "Ürünlerimiz sipariş üzerine size özel üretildiği için teslimat süremiz, ürünün detayına ve yoğunluğa bağlı olarak ortalama 10-15 iş günü arasındadır."
                },
                {
                    question: "Türkiye'nin her yerine gönderim yapıyor musunuz?",
                    answer: "Evet, anlaşmalı olduğumuz lojistik firmalarıyla Türkiye'nin 81 iline güvenli bir şekilde gönderim sağlıyoruz."
                },
                {
                    question: "Ürünler kurulu mu geliyor, kurulumu ben mi yapacağım?",
                    answer: "Birçok ürünümüz (sehpa, askılık, aksesuar vb.) kullanıma hazır, kurulu şekilde gelir. Yemek masası veya büyük kitaplık gibi ürünlerimiz ise kargoda zarar görmemesi için demonte gönderilebilir. Ancak endişelenmeyin; kurulum şeması ve gerekli tüm malzemeler paket içerisindedir, kurulumu oldukça basittir."
                }
            ]
        },
        {
            title: "4. Kurumsal ve Proje Bazlı Çalışmalar",
            items: [
                {
                    question: "Kafe, restoran veya ofis projeleri için toplu üretim yapıyor musunuz?",
                    answer: "Evet, Toff olarak mimari projelere ve kurumsal ihtiyaçlara profesyonel çözümler sunuyoruz. Toplu siparişlerinizde proje bazlı fiyatlandırma ve termin süresi planlaması için \"Kurumsal\" sayfamızdan bizimle iletişime geçebilirsiniz."
                },
                {
                    question: "İç mimarlarla çalışıyor musunuz?",
                    answer: "Memnuniyetle. İç mimarların projelerine özel üretim desteği sağlıyor ve çözüm ortağı olarak yer alıyoruz."
                }
            ]
        },
        {
            title: "5. İade ve Değişim",
            items: [
                {
                    question: "Ürün kargoda hasar görürse ne yapmalıyım?",
                    answer: "Tüm gönderilerimiz sigortalıdır. Kargo teslimatı sırasında pakette bir hasar görürseniz, kargo görevlisine \"Hasar Tespit Tutanağı\" tutturmanız gerekmektedir. Ardından bizimle iletişime geçtiğinizde, hasarlı parça veya ürünün telafisi ivedilikle sağlanır."
                },
                {
                    question: "Özel ölçü ile üretilen ürünü iade edebilir miyim?",
                    answer: "Kişiye özel ölçü ve renk ile üretilen ürünlerde (ayıplı/kusurlu mal durumu hariç) cayma hakkı kapsamında iade alınamamaktadır. Standart ölçülü ürünlerde ise yasal iade süresi geçerlidir."
                }
            ]
        }
    ];

    return (
        <div className="faq-page-container" style={styles.container}>

            <div style={styles.headerSection}>
                <h1 style={styles.mainTitle}>Sıkça Sorulan Sorular</h1>
                <h2 style={styles.subTitle}>Aklınıza takılanlar için buradayız</h2>
                <div style={styles.divider}></div>
            </div>

            <div style={styles.faqList}>
                {faqCategories.map((category, catIndex) => (
                    <div key={catIndex} style={styles.categorySection}>
                        <h3 style={styles.categoryTitle}>{category.title}</h3>

                        {category.items.map((faq, itemIndex) => {
                            const uniqueId = `${catIndex}-${itemIndex}`;
                            const isActive = activeId === uniqueId;

                            return (
                                <div key={itemIndex} style={styles.faqItem}>
                                    <div
                                        style={{
                                            ...styles.questionBox,
                                            backgroundColor: isActive ? 'var(--bg-secondary)' : 'var(--bg-secondary)',
                                            borderBottom: isActive ? '1px solid var(--border-color)' : 'none'
                                        }}
                                        onClick={() => toggleAccordion(uniqueId)}
                                    >
                                        <div style={styles.questionText}>
                                            <FaQuestionCircle style={{ marginRight: '10px', color: 'var(--accent-color)', flexShrink: 0 }} />
                                            <span>{faq.question}</span>
                                        </div>
                                        <div style={styles.icon}>
                                            {isActive ? <FaChevronUp /> : <FaChevronDown />}
                                        </div>
                                    </div>

                                    {isActive && (
                                        <div style={styles.answerBox}>
                                            <p>{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div style={styles.contactRedirect}>
                <p>Aradığınız cevabı bulamadınız mı?</p>
                <Link to="/iletisim" style={styles.contactLink}>Bize Ulaşın</Link>
            </div>

        </div>
    );
}

const styles = {
    container: {
        padding: '60px 20px',
        maxWidth: '900px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', sans-serif",
        color: 'var(--text-secondary)',
    },
    headerSection: {
        textAlign: 'center',
        marginBottom: '50px'
    },
    mainTitle: {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '10px'
    },
    subTitle: {
        fontSize: '1.2rem',
        fontWeight: '300',
        color: 'var(--text-secondary)'
    },
    divider: {
        width: '60px',
        height: '4px',
        backgroundColor: 'var(--accent-color)',
        margin: '20px auto'
    },
    faqList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
    },
    categorySection: {
        marginBottom: '10px'
    },
    categoryTitle: {
        fontSize: '1.4rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '15px',
        borderBottom: '2px solid var(--border-color)',
        paddingBottom: '10px',
        display: 'inline-block'
    },
    faqItem: {
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        marginBottom: '10px'
    },
    questionBox: {
        padding: '20px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'background-color 0.2s'
    },
    questionText: {
        fontSize: '1.05rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        lineHeight: '1.4'
    },
    icon: {
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        marginLeft: '15px'
    },
    answerBox: {
        padding: '20px',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-secondary)',
        lineHeight: '1.6',
        borderTop: '1px solid var(--border-color)'
    },
    contactRedirect: {
        textAlign: 'center',
        marginTop: '50px',
        color: 'var(--text-secondary)'
    },
    contactLink: {
        display: 'inline-block',
        marginTop: '10px',
        color: 'var(--accent-color)',
        fontWeight: 'bold',
        textDecoration: 'none',
        borderBottom: '2px solid var(--accent-color)'
    }
};

export default FAQPage;
