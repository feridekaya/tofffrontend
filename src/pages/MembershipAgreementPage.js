// frontend/src/pages/MembershipAgreementPage.js
import React from 'react';

const ARTICLES = [
    {
        no: '1',
        title: 'Taraflar',
        text: 'İşbu sözleşme; TOFF Design (bundan böyle "TOFF" veya "Satıcı" olarak anılacaktır) ile web sitesi üzerinden üye olan gerçek ya da tüzel kişi (bundan böyle "Üye" olarak anılacaktır) arasında akdedilmiştir.',
    },
    {
        no: '2',
        title: 'Konu ve Kapsam',
        text: 'Bu sözleşme; Üye\'nin thetoffdesign.com adresindeki web sitesini kullanım koşullarını, üyelik hak ve yükümlülüklerini, kişisel verilerin işlenmesine ilişkin bilgilendirmeyi ve tarafların karşılıklı hak ile sorumluluklarını kapsamaktadır.',
    },
    {
        no: '3',
        title: 'Üyelik ve Kullanım Koşulları',
        text: '18 yaşını doldurmuş, medeni hakları kullanma ehliyetine sahip gerçek kişiler ile tüzel kişiler üye olabilir. Üye, sisteme girdiği bilgilerin doğru ve güncel olduğunu beyan eder. Üyelik bilgilerinin güvenliği üyenin sorumluluğundadır. Şifre üçüncü kişilerle paylaşılmamalıdır.',
    },
    {
        no: '4',
        title: 'Kişisel Verilerin Korunması',
        text: 'Üye\'ye ait kişisel veriler, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında işlenmektedir. Veriler; sipariş işleme, teslimat, müşteri hizmetleri ve yasal yükümlülükler için kullanılmaktadır. Kişisel veriler, açık rıza olmaksızın üçüncü kişilerle paylaşılmaz.',
    },
    {
        no: '5',
        title: 'Fikri Mülkiyet Hakları',
        text: 'Web sitesindeki tüm içerik, tasarım, logo, görsel ve yazılı materyaller TOFF\'a aittir ve Fikir ve Sanat Eserleri Kanunu ile diğer ilgili mevzuat kapsamında koruma altındadır. İzinsiz kullanım, çoğaltma ve dağıtım yasal işleme tabi tutulur.',
    },
    {
        no: '6',
        title: 'Üyeliğin Sona Ermesi',
        text: 'Üye, dilediği zaman üyeliğini sonlandırabilir. TOFF, sözleşme koşullarını ihlal eden üyelerin hesaplarını önceden bildirim yapmaksızın askıya alabilir veya tamamen silebilir.',
    },
    {
        no: '7',
        title: 'Uygulanacak Hukuk ve Yetki',
        text: 'İşbu sözleşme Türk Hukuku\'na tabidir. Uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Müdürlükleri yetkilidir.',
    },
    {
        no: '8',
        title: 'Yürürlük',
        text: 'Üye, üyelik işlemini tamamlayarak işbu sözleşmenin tüm hükümlerini okuduğunu, anladığını ve kabul ettiğini beyan eder. Sözleşme, üyelik işleminin tamamlanmasıyla yürürlüğe girer ve üyelik iptal edilmesine kadar yürürlükte kalacaktır.',
    },
];

function MembershipAgreementPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 animate-fade-up">

            <div className="text-center mb-12">
                <p className="text-xs font-bold text-toff-accent tracking-[0.3em] uppercase mb-3">Yasal Metin</p>
                <h1 className="text-3xl font-black text-toff-text mb-3">Web Sitesi Kullanım & Üyelik Sözleşmesi</h1>
                <div className="w-12 h-0.5 bg-toff-accent mx-auto mb-4" />
                <p className="text-xs text-toff-faint">Son Güncelleme: Mart 2025</p>
            </div>

            <div className="flex flex-col gap-4">
                {ARTICLES.map((art) => (
                    <div key={art.no} className="bg-toff-bg-2 border border-toff-border rounded-xl p-6">
                        <h2 className="text-sm font-bold text-toff-text mb-3">
                            <span className="text-toff-accent mr-2">Madde {art.no}.</span>
                            {art.title}
                        </h2>
                        <p className="text-sm text-toff-muted leading-relaxed">{art.text}</p>
                    </div>
                ))}

                <div className="bg-toff-accent/5 border border-toff-accent/20 rounded-xl p-5 text-center">
                    <p className="text-xs text-toff-faint">
                        Sorularınız için:{' '}
                        <a href="mailto:thetoffdesign@gmail.com" className="text-toff-accent hover:underline">
                            thetoffdesign@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MembershipAgreementPage;
