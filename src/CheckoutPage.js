// frontend/src/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CheckoutPage.css';
import API_BASE_URL from './config/api';
import CheckoutAddressForm from './CheckoutAddressForm';
import { FaCheckCircle, FaPlus } from 'react-icons/fa';

function CheckoutPage({ cart, setCart, authTokens }) {
    const navigate = useNavigate();

    // -- State --
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Manual form state (used for Guest OR if user wants to type manually)
    const [deliveryInfo, setDeliveryInfo] = useState({
        fullName: '',
        phone: '',
        city: '',
        address: ''
    });

    // Payment state
    const [paymentInfo, setPaymentInfo] = useState({
        cardHolder: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // -- Effects --
    useEffect(() => {
        let tokens = authTokens;
        if (!tokens) {
            const stored = localStorage.getItem('authTokens');
            if (stored) tokens = JSON.parse(stored);
        }

        if (tokens && tokens.access) {
            fetchSavedAddresses(tokens.access);
        }
    }, [authTokens]);

    const fetchSavedAddresses = async (accessToken) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/addresses/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setSavedAddresses(response.data);

            // Auto-select first address if exists
            if (response.data.length > 0) {
                selectAddress(response.data[0]);
            }
        } catch (error) {
            console.error("Adresler çekilemedi:", error);
            // Optional: User facing error if needed, but console is good for now.
        }
    };

    // -- Handlers --
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (parseFloat(item.product.price) * item.quantity), 0);
    };
    const total = calculateTotal();

    const handleDeliveryChange = (e) => {
        setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
        // If user types manually, clear selection
        if (selectedAddressId) setSelectedAddressId(null);
    };

    const handlePaymentChange = (e) => setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });

    const selectAddress = (addr) => {
        setSelectedAddressId(addr.id);
        setDeliveryInfo({
            fullName: `${addr.first_name} ${addr.last_name}`,
            phone: addr.phone_number,
            city: addr.city,
            address: `${addr.address_text} \n${addr.neighborhood}, ${addr.district}`
        });
    };

    const handleAddressSaved = () => {
        setShowAddModal(false);
        fetchSavedAddresses(); // Refresh list, it will auto-select 1st or we can improve logic
    };

    const handleCompleteOrder = async () => {
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
            const orderData = {
                full_name: deliveryInfo.fullName,
                address: deliveryInfo.address,
                city: deliveryInfo.city,
                phone: deliveryInfo.phone,
                cart_items: cart.map(item => ({
                    product: { id: item.product.id },
                    quantity: item.quantity,
                    selected_size: item.selectedSize ? { name: item.selectedSize.name } : null,
                    selected_color: item.selectedColor ? { name: item.selectedColor.name } : null
                }))
            };

            const response = await fetch(`${API_BASE_URL}/api/orders/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(authTokens?.access && { 'Authorization': `Bearer ${authTokens.access}` })
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                // If Guest and successful, maybe suggest saving address? (Not in reqs)

                alert('Siparişiniz Alındı! Teşekkür ederiz.');
                setCart([]);
                navigate('/');
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

    const getImageUrl = (product) => product.image ? product.image : null;

    return (
        <div className="checkout-page-container">
            <h1>ÖDEME</h1>

            <div className="checkout-layout">
                {/* SOL SÜTUN */}
                <div className="checkout-left-column">

                    {/* ADRES SEÇİMİ (Only if logged in) */}
                    {(authTokens || localStorage.getItem('authTokens')) && (
                        <div className="checkout-section">
                            <h2>Teslimat Adresi Seçimi</h2>
                            <div className="address-grid-checkout">
                                {savedAddresses.map(addr => (
                                    <div
                                        key={addr.id}
                                        className={`address-card-checkout ${selectedAddressId === addr.id ? 'selected' : ''}`}
                                        onClick={() => selectAddress(addr)}
                                    >
                                        <div className="card-header-row">
                                            <h4>{addr.title}</h4>
                                            {selectedAddressId === addr.id && <FaCheckCircle className="check-icon" />}
                                        </div>
                                        <p>{addr.first_name} {addr.last_name}</p>
                                        <p className="sm-text">{addr.district}, {addr.city}</p>
                                    </div>
                                ))}

                                <div className="add-address-card" onClick={() => setShowAddModal(true)}>
                                    <FaPlus className="plus-icon" />
                                    <span>Yeni Adres Ekle</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TESLİMAT ADRESİ FORMU (Always visible to show what's selected or for manual entry) */}
                    <div className="checkout-section">
                        <div className="card-header-row" style={{ marginBottom: '20px', borderBottom: '2px solid #C08B5C', paddingBottom: '10px' }}>
                            <h2 style={{ border: 'none', margin: 0, padding: 0 }}>Teslimat Detayları</h2>
                            {selectedAddressId && (
                                <button
                                    onClick={() => {
                                        setSelectedAddressId(null);
                                        setDeliveryInfo({ fullName: '', phone: '', city: '', address: '' });
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#C08B5C',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Farklı Adres Gir
                                </button>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Ad Soyad *</label>
                            <input
                                type="text" name="fullName" value={deliveryInfo.fullName}
                                onChange={handleDeliveryChange} placeholder="Adınız Soyadınız" required
                                disabled={!!selectedAddressId}
                            />
                        </div>
                        <div className="form-group">
                            <label>Telefon *</label>
                            <input
                                type="tel" name="phone" value={deliveryInfo.phone}
                                onChange={handleDeliveryChange} placeholder="0555..." required
                                disabled={!!selectedAddressId}
                            />
                        </div>
                        <div className="form-group">
                            <label>Şehir *</label>
                            <input
                                type="text" name="city" value={deliveryInfo.city}
                                onChange={handleDeliveryChange} placeholder="İl" required
                                disabled={!!selectedAddressId}
                            />
                        </div>
                        <div className="form-group">
                            <label>Açık Adres *</label>
                            <textarea
                                name="address" value={deliveryInfo.address}
                                onChange={handleDeliveryChange} rows="3" placeholder="Adres detayları..." required
                                disabled={!!selectedAddressId}
                            />
                        </div>
                    </div>

                    {/* SİPARİŞ ÖZETİ */}
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

                {/* SAĞ SÜTUN (Ödeme) */}
                <div className="checkout-right-column">
                    <div className="checkout-sticky-box">
                        <div className="checkout-section">
                            <h2>Ödeme Bilgileri</h2>
                            <div className="form-group">
                                <label>Kart Sahibi *</label>
                                <input type="text" name="cardHolder" value={paymentInfo.cardHolder} onChange={handlePaymentChange} required />
                            </div>
                            <div className="form-group">
                                <label>Kart Numarası *</label>
                                <input type="text" name="cardNumber" value={paymentInfo.cardNumber} onChange={handlePaymentChange} maxLength="19" required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>SKT *</label>
                                    <input type="text" name="expiryDate" value={paymentInfo.expiryDate} onChange={handlePaymentChange} placeholder="AA/YY" maxLength="5" required />
                                </div>
                                <div className="form-group">
                                    <label>CVV *</label>
                                    <input type="text" name="cvv" value={paymentInfo.cvv} onChange={handlePaymentChange} maxLength="3" required />
                                </div>
                            </div>
                        </div>

                        <div className="checkout-total-section">
                            <h3>Ödenecek Tutar</h3>
                            <div className="checkout-total-amount">{total.toFixed(2)} TL</div>
                        </div>

                        {errorMessage && <div className="checkout-error-message">{errorMessage}</div>}

                        <button className="complete-order-btn" onClick={handleCompleteOrder} disabled={isSubmitting}>
                            {isSubmitting ? 'İşleniyor...' : 'Siparişi Tamamla'}
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL for Adding Address */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <CheckoutAddressForm
                            authTokens={authTokens}
                            onSuccess={handleAddressSaved}
                            onCancel={() => setShowAddModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckoutPage;

