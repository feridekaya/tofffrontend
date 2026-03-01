// frontend/src/pages/ContactPage.js
import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import contactService from '../services/contactService';

const CONTACT_INFO = [
    {
        icon: <FaMapMarkerAlt size={18} />,
        title: 'Adres',
        lines: ['Toff Design Studio', 'Maslak Mah. Büyükdere Cad. No:123', 'Sarıyer / İstanbul'],
        href: null,
    },
    {
        icon: <FaPhoneAlt size={16} />,
        title: 'Telefon',
        lines: ['+90 542 450 93 42'],
        sub: 'Hafta içi: 09:00 – 18:00',
        href: 'tel:+905424509342',
    },
    {
        icon: <FaWhatsapp size={20} />,
        title: 'WhatsApp Hattı',
        lines: ['+90 542 450 93 42'],
        sub: '7/24 mesaj bırakabilirsiniz',
        href: 'https://wa.me/905424509342',
        green: true,
    },
    {
        icon: <FaEnvelope size={16} />,
        title: 'E-Posta',
        lines: ['thetoffdesign@gmail.com'],
        href: 'mailto:thetoffdesign@gmail.com',
    },
];

function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: 'Genel Bilgi', message: '' });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        try {
            await contactService.sendContact(form);
            setStatus('success');
            setForm({ name: '', email: '', subject: 'Genel Bilgi', message: '' });
        } catch {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = 'w-full bg-toff-bg border border-toff-border text-toff-text text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-toff-accent transition-colors placeholder:text-toff-faint';
    const labelClass = 'block text-xs font-bold text-toff-faint uppercase tracking-wider mb-1.5';

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 animate-fade-up">

            {/* Başlık */}
            <div className="mb-12 text-center">
                <p className="text-xs font-bold text-toff-accent tracking-[0.3em] uppercase mb-3">İletişim</p>
                <h1 className="text-3xl sm:text-4xl font-black text-toff-text mb-4">Size Nasıl Yardımcı Olabiliriz?</h1>
                <div className="w-12 h-0.5 bg-toff-accent mx-auto" />
            </div>

            {/* İki Sütun */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                {/* ── Sol: İletişim Bilgileri ───────────────────────────────── */}
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-toff-muted leading-relaxed mb-2">
                        Sorularınız, önerileriniz veya iş birlikleri için bize aşağıdaki kanallardan ulaşabilirsiniz.
                        Ekibimiz en kısa sürede size dönüş yapacaktır.
                    </p>

                    {CONTACT_INFO.map((item, i) => {
                        const Wrapper = item.href ? 'a' : 'div';
                        const wrapperProps = item.href
                            ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
                            : {};
                        return (
                            <Wrapper
                                key={i}
                                {...wrapperProps}
                                className={`flex items-start gap-4 bg-toff-bg-2 border rounded-xl p-5 transition-all group
                  ${item.href ? 'hover:border-toff-accent cursor-pointer' : ''}
                  ${item.green ? 'border-green-800/40 hover:border-green-500' : 'border-toff-border'}`}
                            >
                                {/* İkon */}
                                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                  ${item.green
                                        ? 'bg-green-900/30 text-green-400 group-hover:bg-green-800/40'
                                        : 'bg-toff-accent/10 text-toff-accent'}`}
                                >
                                    {item.icon}
                                </div>

                                {/* İçerik */}
                                <div>
                                    <p className="text-xs font-bold text-toff-faint uppercase tracking-widest mb-1">{item.title}</p>
                                    {item.lines.map((line, j) => (
                                        <p key={j} className={`text-sm font-semibold ${item.green ? 'text-green-400' : 'text-toff-text'}`}>
                                            {line}
                                        </p>
                                    ))}
                                    {item.sub && <p className="text-xs text-toff-faint mt-0.5">{item.sub}</p>}
                                </div>
                            </Wrapper>
                        );
                    })}
                </div>

                {/* ── Sağ: Mail Gönderme Formu ─────────────────────────────── */}
                <div className="bg-toff-bg-2 border border-toff-border rounded-2xl p-6 sm:p-8">
                    <h2 className="text-lg font-bold text-toff-text mb-1">Bize Yazın</h2>
                    <p className="text-sm text-toff-muted mb-6">Mesajınız doğrudan ekibimize iletilir.</p>

                    {status === 'success' && (
                        <div className="mb-5 bg-green-900/30 border border-green-700/50 text-green-400 text-sm px-4 py-3 rounded-xl">
                            ✓ Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağız.
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="mb-5 bg-red-900/30 border border-red-700/50 text-red-400 text-sm px-4 py-3 rounded-xl">
                            ✕ Bir hata oluştu. Lütfen tekrar deneyin.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Adınız *</label>
                                <input
                                    type="text" name="name" value={form.name} required
                                    onChange={handleChange} className={inputClass} placeholder="Ad Soyad"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>E-Posta *</label>
                                <input
                                    type="email" name="email" value={form.email} required
                                    onChange={handleChange} className={inputClass} placeholder="ornek@mail.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Konu</label>
                            <select
                                name="subject" value={form.subject}
                                onChange={handleChange} className={inputClass}
                            >
                                {['Genel Bilgi', 'Sipariş Durumu', 'Ürün Bilgisi', 'Kurumsal Satış', 'İade / Değişim', 'Diğer'].map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Mesajınız *</label>
                            <textarea
                                name="message" value={form.message} required rows={5}
                                onChange={handleChange} className={`${inputClass} resize-none`}
                                placeholder="Mesajınızı buraya yazın..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-toff-accent hover:bg-toff-accent-3 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl tracking-widest text-sm transition-colors"
                        >
                            {loading ? 'GÖNDERİLİYOR...' : 'MESAJ GÖNDER'}
                        </button>

                        <p className="text-xs text-toff-faint text-center">
                            veya direkt yazın: <a href="mailto:thetoffdesign@gmail.com" className="text-toff-accent hover:underline">thetoffdesign@gmail.com</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
