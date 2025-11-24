// frontend/src/CheckoutPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

function CheckoutPage({ cart, setCart, authTokens }) {
    const navigate = useNavigate();

    // Teslimat Adresi State
    const [deliveryInfo, setDeliveryInfo] = useState({
        fullName: '',
        phone: '',
        city: '',
        address: ''
    });

    // Ödeme Bilgileri State (Görsel amaçlı)
    const [paymentInfo, setPaymentInfo] = useState({
        cardHolder: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Sepet toplamını hesapla
    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            return total + (parseFloat(item.product.price) * item.quantity);
        }, 0);
    };

    const total = calculateTotal();

    // Form input değişikliklerini handle et
    const handleDeliveryChange = (e) => {
        setDeliveryInfo({
            ...deliveryInfo,
            [e.target.name]: e.target.value
        });
    };

    const handlePaymentChange = (e) => {
        setPaymentInfo({
            ...paymentInfo,
            [e.target.name]: e.target.value
        });
    };

    // Sipariş oluşturma
    const handleCompleteOrder = async () => {
        // Form validasyonu
        if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.city || !deliveryInfo.address) {
            setErrorMessage('Lütfen tüm teslimat bilgilerini doldurunuz.');
            return;
        }

        if (!paymentInfo.cardHolder || !paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv) {
            setErrorMessage('Lütfen tüm ödeme bilgilerini doldurunuz.');
            return;
        }

        if (cart.length === 0) {
            setErrorMessage('Sepetiniz boş.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            // Backend'e gönderilecek veri formatı
            const orderData = {
                full_name: deliveryInfo.fullName,
                address: deliveryInfo.address,
                city: deliveryInfo.city,
                phone: deliveryInfo.phone,
                cart_items: cart.map(item => ({
                    product: { id: item.product.id },
                    quantity: item.quantity
                }))
            };

            const response = await fetch('http://127.0.0.1:8000/api/orders/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(authTokens?.access && { 'Authorization': `Bearer ${authTokens.access}` })
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                // Başarılı sipariş
                alert('Siparişiniz Alındı! Teşekkür ederiz.');
                setCart([]); // Sepeti temizle
                navigate('/'); // Ana sayfaya yönlendir (veya /siparis-basarili sayfasına)
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.detail || 'Sipariş oluşturulurken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Sipariş hatası:', error);
            setErrorMessage('Sunucuya bağlanırken bir hata oluştu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Resim URL fonksiyonu
    const getImageUrl = (product) => {
        return product.image ? product.image : null;
    };

    return (
        <div className="checkout-page-container">
            <h1>ÖDEME</h1>

            <div className="checkout-layout">
                {/* SOL SÜTUN */}
                <div className="checkout-left-column">
                    {/* Teslimat Adresi Formu */}
                    <div className="checkout-section">
                        <h2>Teslimat Adresi</h2>
                        <div className="form-group">
                            <label htmlFor="fullName">Ad Soyad *</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={deliveryInfo.fullName}
                                onChange={handleDeliveryChange}
                                placeholder="Adınız ve Soyadınız"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Telefon *</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={deliveryInfo.phone}
                                onChange={handleDeliveryChange}
                                placeholder="0555 123 45 67"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">Şehir *</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={deliveryInfo.city}
                                onChange={handleDeliveryChange}
                                placeholder="İstanbul"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Açık Adres *</label>
                            <textarea
                                id="address"
                                name="address"
                                value={deliveryInfo.address}
                                onChange={handleDeliveryChange}
                                placeholder="Mahalle, Sokak, Bina No, Daire No..."
                                rows="4"
                                required
                            />
                        </div>
                    </div>

                    {/* Sipariş Özeti */}
                    <div className="checkout-section">
                        <h2>Sipariş Özeti</h2>
                        <div className="order-summary-list">
                            {cart.map(item => (
                                <div key={item.cartId || item.product.id} className="order-summary-item">
                                    <div className="order-item-image">
                                        <img src={getImageUrl(item.product)} alt={item.product.name} />
                                    </div>
                                    <div className="order-item-info">
                                        <h4>{item.product.name}</h4>
                                        <p>{item.quantity} x {parseFloat(item.product.price).toFixed(2)} TL</p>
                                    </div>
                                    <div className="order-item-total">
                                        <strong>{(parseFloat(item.product.price) * item.quantity).toFixed(2)} TL</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SAĞ SÜTUN (Sticky) */}
                <div className="checkout-right-column">
                    <div className="checkout-sticky-box">
                        {/* Ödeme Bilgileri */}
                        <div className="checkout-section">
                            <h2>Ödeme Bilgileri</h2>
                            <div className="form-group">
                                <label htmlFor="cardHolder">Kart Sahibi *</label>
                                <input
                                    type="text"
                                    id="cardHolder"
                                    name="cardHolder"
                                    value={paymentInfo.cardHolder}
                                    onChange={handlePaymentChange}
                                    placeholder="AD SOYAD"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="cardNumber">Kart Numarası *</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={paymentInfo.cardNumber}
                                    onChange={handlePaymentChange}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="expiryDate">Son Kullanma *</label>
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        name="expiryDate"
                                        value={paymentInfo.expiryDate}
                                        onChange={handlePaymentChange}
                                        placeholder="AA/YY"
                                        maxLength="5"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cvv">CVV *</label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        name="cvv"
                                        value={paymentInfo.cvv}
                                        onChange={handlePaymentChange}
                                        placeholder="123"
                                        maxLength="3"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ödenecek Tutar */}
                        <div className="checkout-total-section">
                            <h3>Ödenecek Tutar</h3>
                            <div className="checkout-total-amount">
                                {total.toFixed(2)} TL
                            </div>
                        </div>

                        {/* Hata Mesajı */}
                        {errorMessage && (
                            <div className="checkout-error-message">
                                {errorMessage}
                            </div>
                        )}

                        {/* Siparişi Tamamla Butonu */}
                        <button
                            className="complete-order-btn"
                            onClick={handleCompleteOrder}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'İşleniyor...' : 'Siparişi Tamamla'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
