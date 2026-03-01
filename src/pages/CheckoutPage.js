// frontend/src/pages/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CheckoutAddressForm from '../components/account/CheckoutAddressForm';
import { FaCheckCircle, FaPlus } from 'react-icons/fa';
import addressService from '../services/addressService';
import orderService from '../services/orderService';

const inputClass = 'w-full bg-toff-bg border border-toff-border-2 text-toff-text rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-toff-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
const labelClass = 'block text-xs font-semibold text-toff-muted uppercase tracking-wider mb-1.5';

function CheckoutPage() {
    const { authTokens } = useAuth();
    const { cart, setCart, clearCart } = useCart();
    const navigate = useNavigate();

    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [deliveryInfo, setDeliveryInfo] = useState({ fullName: '', phone: '', city: '', address: '' });
    const [paymentInfo, setPaymentInfo] = useState({ cardHolder: '', cardNumber: '', expiryDate: '', cvv: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [agreementChecked, setAgreementChecked] = useState(false);

    useEffect(() => {
        if (authTokens) fetchSavedAddresses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authTokens]);

    const fetchSavedAddresses = async () => {
        try {
            const res = await addressService.getAddresses();
            setSavedAddresses(res.data);
            if (res.data.length > 0) selectAddress(res.data[0]);
        } catch { }
    };

    const total = cart.reduce((t, item) => t + parseFloat(item.product.price) * item.quantity, 0);

    const handleDeliveryChange = (e) => {
        setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
        if (selectedAddressId) setSelectedAddressId(null);
    };
    const handlePaymentChange = (e) => setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });

    const selectAddress = (addr) => {
        setSelectedAddressId(addr.id);
        setDeliveryInfo({
            fullName: `${addr.first_name} ${addr.last_name}`,
            phone: addr.phone_number,
            city: addr.city,
            address: `${addr.address_text}\n${addr.neighborhood}, ${addr.district}`,
        });
    };

    const handleCompleteOrder = async () => {
        if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.city || !deliveryInfo.address) {
            return setErrorMessage('Lütfen tüm teslimat bilgilerini doldurunuz.');
        }
        if (!paymentInfo.cardHolder || !paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv) {
            return setErrorMessage('Lütfen tüm ödeme bilgilerini doldurunuz.');
        }
        if (cart.length === 0) return setErrorMessage('Sepetiniz boş.');

        setIsSubmitting(true);
        setErrorMessage('');
        try {
            const res = await orderService.createOrder({
                full_name: deliveryInfo.fullName,
                address: deliveryInfo.address,
                city: deliveryInfo.city,
                phone: deliveryInfo.phone,
                cart_items: cart.map(item => ({
                    product: { id: item.product.id },
                    quantity: item.quantity,
                    selectedSize: item.selectedSize || null,
                    selectedColor: item.selectedColor || null,
                })),
                card_info: paymentInfo,
            });
            if (res.data.success) {
                if (clearCart) clearCart();
                navigate('/');
                alert(`Siparişiniz Alındı! Sipariş No: #${res.data.order_id}`);
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.error || 'Sipariş oluşturulurken bir hata oluştu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const sectionCard = 'bg-toff-bg-2 border border-toff-border rounded-xl p-5 mb-5';
    const sectionTitle = 'text-sm font-bold text-toff-text tracking-widest uppercase mb-4 pb-3 border-b border-toff-border';

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-up">
            <h1 className="text-2xl font-bold text-toff-text tracking-wider mb-8">ÖDEME</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ── Sol Sütun ─────────────────────────────────────────────── */}
                <div className="lg:col-span-2 flex flex-col">

                    {/* Adres Seçimi */}
                    {authTokens && (
                        <div className={sectionCard}>
                            <h2 className={sectionTitle}>Teslimat Adresi</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {savedAddresses.map(addr => (
                                    <div
                                        key={addr.id}
                                        onClick={() => selectAddress(addr)}
                                        className={`cursor-pointer border rounded-xl p-4 transition-all ${selectedAddressId === addr.id
                                            ? 'border-toff-accent bg-toff-accent/5'
                                            : 'border-toff-border hover:border-toff-muted'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-sm font-bold text-toff-text">{addr.title}</h4>
                                            {selectedAddressId === addr.id && <FaCheckCircle className="text-toff-accent" size={14} />}
                                        </div>
                                        <p className="text-sm text-toff-muted">{addr.first_name} {addr.last_name}</p>
                                        <p className="text-xs text-toff-faint mt-0.5">{addr.district}, {addr.city}</p>
                                    </div>
                                ))}

                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="border border-dashed border-toff-border hover:border-toff-accent rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-toff-faint hover:text-toff-accent transition-colors"
                                >
                                    <FaPlus size={18} />
                                    <span className="text-xs font-semibold">Yeni Adres Ekle</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Teslimat Detayları */}
                    <div className={sectionCard}>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-toff-border">
                            <h2 className="text-sm font-bold text-toff-text tracking-widest uppercase">Teslimat Detayları</h2>
                            {selectedAddressId && (
                                <button
                                    onClick={() => { setSelectedAddressId(null); setDeliveryInfo({ fullName: '', phone: '', city: '', address: '' }); }}
                                    className="text-xs text-toff-accent underline hover:text-toff-accent-2 transition-colors"
                                >
                                    Farklı Adres Gir
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Ad Soyad *</label>
                                <input type="text" name="fullName" value={deliveryInfo.fullName} onChange={handleDeliveryChange}
                                    disabled={!!selectedAddressId} className={inputClass} placeholder="Adınız Soyadınız" />
                            </div>
                            <div>
                                <label className={labelClass}>Telefon *</label>
                                <input type="tel" name="phone" value={deliveryInfo.phone} onChange={handleDeliveryChange}
                                    disabled={!!selectedAddressId} className={inputClass} placeholder="0555 000 00 00" />
                            </div>
                            <div>
                                <label className={labelClass}>Şehir *</label>
                                <input type="text" name="city" value={deliveryInfo.city} onChange={handleDeliveryChange}
                                    disabled={!!selectedAddressId} className={inputClass} placeholder="İl" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Açık Adres *</label>
                                <textarea name="address" value={deliveryInfo.address} onChange={handleDeliveryChange} rows={3}
                                    disabled={!!selectedAddressId} className={`${inputClass} resize-none`} placeholder="Adres detayları..." />
                            </div>
                        </div>
                    </div>

                    {/* Sipariş Özeti */}
                    <div className={sectionCard}>
                        <h2 className={sectionTitle}>Sipariş Özeti</h2>
                        <div className="flex flex-col gap-3">
                            {cart.map(item => (
                                <div key={item.cartId || item.product.id} className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-toff-bg-3 rounded-lg overflow-hidden shrink-0">
                                        {item.product.image
                                            ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full bg-toff-bg-3" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-toff-text truncate">{item.product.name}</p>
                                        <p className="text-xs text-toff-muted">{item.quantity} × {parseFloat(item.product.price).toLocaleString('tr-TR')} ₺</p>
                                    </div>
                                    <span className="text-sm font-bold text-toff-text shrink-0">
                                        {(parseFloat(item.product.price) * item.quantity).toLocaleString('tr-TR')} ₺
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Sağ Sütun: Ödeme ──────────────────────────────────────── */}
                <div>
                    <div className="sticky top-[80px]">
                        {/* Kart Bilgileri */}
                        <div className={sectionCard}>
                            <h2 className={sectionTitle}>Ödeme Bilgileri</h2>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className={labelClass}>Kart Sahibi *</label>
                                    <input type="text" name="cardHolder" value={paymentInfo.cardHolder} onChange={handlePaymentChange} className={inputClass} placeholder="Ad Soyad" />
                                </div>
                                <div>
                                    <label className={labelClass}>Kart Numarası *</label>
                                    <input type="text" name="cardNumber" value={paymentInfo.cardNumber} onChange={handlePaymentChange} maxLength={19} className={inputClass} placeholder="**** **** **** ****" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>SKT *</label>
                                        <input type="text" name="expiryDate" value={paymentInfo.expiryDate} onChange={handlePaymentChange} maxLength={5} className={inputClass} placeholder="AA/YY" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>CVV *</label>
                                        <input type="text" name="cvv" value={paymentInfo.cvv} onChange={handlePaymentChange} maxLength={3} className={inputClass} placeholder="***" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Toplam & Sipariş Butonu */}
                        <div className={sectionCard}>
                            <div className="flex justify-between items-center mb-5">
                                <span className="text-sm text-toff-muted">Ödenecek Tutar</span>
                                <span className="text-2xl font-extrabold text-toff-accent">{total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                            </div>

                            {errorMessage && (
                                <div className="mb-4 bg-red-900/30 border border-red-700/50 text-red-400 text-sm px-4 py-3 rounded-lg">
                                    {errorMessage}
                                </div>
                            )}

                            {/* Sözleşme Onay Checkbox */}
                            <div className="mb-4 flex items-start gap-2.5 p-3 bg-toff-bg rounded-lg border border-toff-border">
                                <input
                                    type="checkbox"
                                    id="agreement"
                                    checked={agreementChecked}
                                    onChange={e => setAgreementChecked(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 shrink-0 accent-amber-600 cursor-pointer"
                                />
                                <label htmlFor="agreement" className="text-xs text-toff-muted cursor-pointer leading-relaxed">
                                    <Link to="/kargo-iade" target="_blank" className="text-toff-accent hover:underline">Ön Bilgilendirme Formu</Link>
                                    {' '}ve{' '}
                                    <Link to="/uyelik-sozlesmesi" target="_blank" className="text-toff-accent hover:underline">Mesafeli Satış Sözleşmesi</Link>'ni
                                    {' '}okudum, onaylıyorum.
                                </label>
                            </div>

                            <button
                                onClick={handleCompleteOrder}
                                disabled={isSubmitting || !agreementChecked}
                                className="w-full bg-toff-accent hover:bg-toff-accent-3 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 tracking-widest text-sm rounded-lg transition-colors"
                            >
                                {isSubmitting ? 'İŞLENİYOR...' : 'SİPARİŞİ TAMAMLA'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Adres Ekleme Modal ─────────────────────────────────────── */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-toff-bg-2 border border-toff-border rounded-xl w-full max-w-lg shadow-2xl">
                        <CheckoutAddressForm
                            authTokens={authTokens}
                            onSuccess={() => { setShowAddModal(false); fetchSavedAddresses(); }}
                            onCancel={() => setShowAddModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckoutPage;
