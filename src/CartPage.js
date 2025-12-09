// frontend/src/CartPage.js
import React, { useState } from 'react';
import './CartPage.css';
import { Link, useNavigate } from 'react-router-dom';

import API_BASE_URL from './config/api';

function CartPage({ cart, setCart, authTokens }) {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  // Sözleşme Onayı State
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ürünü kaldırma fonksiyonu (cartId'ye göre)
  const handleRemoveFromCart = async (cartIdToRemove) => {
    // 1. GİRİŞ YAPMIŞSA -> BACKEND
    if (authTokens) {
      try {
        await fetch(`${API_BASE_URL}/api/cart/remove_item/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`
          },
          body: JSON.stringify({ item_id: cartIdToRemove })
        });
        // Başarılı olursa state'den de sil
      } catch (error) {
        console.error('Silme hatası:', error);
        alert('Ürün silinirken bir hata oluştu');
        return;
      }
    }

    // 2. HER DURUMDA LOCAL STATE GÜNCELLE
    const updatedCart = cart.filter(item => item.cartId !== cartIdToRemove);
    setCart(updatedCart);
  };

  // Adet (quantity) değiştirme (cartId'ye göre)
  const handleQuantityChange = async (cartId, newQuantity) => {
    const quantityNum = parseInt(newQuantity);

    if (quantityNum > 0) {
      // 1. GİRİŞ YAPMIŞSA -> BACKEND
      if (authTokens) {
        try {
          await fetch(`${API_BASE_URL}/api/cart/update_quantity/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authTokens.access}`
            },
            body: JSON.stringify({ item_id: cartId, quantity: quantityNum })
          });
        } catch (error) {
          console.error('Güncelleme hatası:', error);
          // Hata olursa geri alabiliriz ama şimdilik sadece logluyoruz
        }
      }

      // 2. HER DURUMDA LOCAL STATE GÜNCELLE
      const updatedCart = cart.map(item => {
        if (item.cartId === cartId) {
          return { ...item, quantity: quantityNum };
        }
        return item;
      });
      setCart(updatedCart);
    }
  };

  // --- HESAPLAMALAR ---

  // 1. Ara Toplam (Ürünlerin toplam fiyatı)
  const subtotal = cart.reduce((total, item) => {
    return total + (parseFloat(item.product.price) * item.quantity);
  }, 0);

  // 2. KDV (%20 varsayalım, fiyata dahilse ayırıp gösterelim)
  // Türkiye'de genelde fiyatlar KDV dahildir. Bilgi amaçlı gösteriyoruz.
  const kdvRate = 0.20;
  const kdvAmount = subtotal - (subtotal / (1 + kdvRate));

  // 3. Kargo (1000 TL üzeri ücretsiz, altı 100 TL)
  const shippingThreshold = 1000;
  const shippingCost = subtotal >= shippingThreshold ? 0 : 100;

  // 4. Kupon Uygulama - Backend API ile
  const handleApplyCoupon = async () => {
    if (!couponCode) return;

    try {
      const response = await fetch('http://localhost:8000/api/coupons/validate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await response.json();

      if (response.ok) {
        // Kupon geçerli
        const disc = subtotal * (data.discount_percent / 100);
        setDiscount(disc);
        setAppliedCoupon(data.code);
        alert(`Kupon uygulandı: %${data.discount_percent} indirim`);
      } else {
        // Kupon geçersiz veya hata
        alert(data.error || 'Geçersiz kupon kodu.');
        setDiscount(0);
        setAppliedCoupon(null);
      }
    } catch (error) {
      console.error('Kupon doğrulama hatası:', error);
      alert('Kupon doğrulanırken bir hata oluştu.');
      setDiscount(0);
      setAppliedCoupon(null);
    }
  };

  // 5. Genel Toplam
  const totalPayable = subtotal + shippingCost - discount;

  // Satın Al Butonu İşlemi
  const handleCheckout = () => {
    if (!isAgreementChecked) {
      alert('Lütfen Mesafeli Satış Sözleşmesini onaylayınız.');
      return;
    }
    // Ödeme sayfasına yönlendir
    navigate('/odeme');
  };

  // Resim URL fonksiyonu
  const getImageUrl = (product) => {
    return product.image ? product.image : null;
  };

  return (
    <div className="cart-page-container">
      <h1>SEPETİM</h1>
      <div className="cart-layout">
        {/* --- SÜTUN 1: SEPET LİSTESİ --- */}
        <div className="cart-items-column">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>Sepetinizde henüz ürün bulunmamaktadır.</p>
              <Link to="/" className="continue-shopping-btn">Alışverişe Devam Et</Link>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map(item => (
                <div key={item.cartId || item.product.id} className="cart-item">

                  <div className="cart-item-image">
                    <img src={getImageUrl(item.product)} alt={item.product.name} />
                  </div>

                  <div className="cart-item-info">
                    <h3>{item.product.name}</h3>

                    <div className="cart-item-variants" style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#777' }}>
                      {item.selectedSize && (
                        <div style={{ marginBottom: '4px' }}>
                          <strong>Boyut:</strong> {item.selectedSize.name}
                        </div>
                      )}
                      {item.selectedColor && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <strong>Renk:</strong>
                          <div
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              backgroundColor: item.selectedColor.hex_code,
                              border: '1px solid #ccc'
                            }}
                          />
                          {item.selectedColor.name}
                        </div>
                      )}
                    </div>

                    <p>{(parseFloat(item.product.price) * item.quantity).toFixed(2)} TL</p>

                    <div className="item-quantity-updater">
                      <label htmlFor={`quantity-${item.cartId}`}>Adet: </label>
                      <select
                        id={`quantity-${item.cartId}`}
                        className="quantity-select"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.cartId, e.target.value)}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <button
                      className="remove-item-btn"
                      onClick={() => handleRemoveFromCart(item.cartId)}
                    >
                      Sil
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- SÜTUN 2: SİPARİŞ ÖZETİ --- */}
        <div className="cart-summary-column">
          <div className="summary-box">
            <h2>SİPARİŞ ÖZETİ</h2>

            <div className="summary-row">
              <span>Ara Toplam</span>
              <span>{subtotal.toFixed(2)} TL</span>
            </div>

            <div className="summary-row" style={{ fontSize: '0.9rem', color: '#777' }}>
              <span>KDV (%20 Dahil)</span>
              <span>{kdvAmount.toFixed(2)} TL</span>
            </div>

            <div className="summary-row">
              <span>Kargo</span>
              <span>{shippingCost === 0 ? 'Ücretsiz' : `${shippingCost.toFixed(2)} TL`}</span>
            </div>

            {shippingCost > 0 && (
              <div style={{ fontSize: '0.8rem', color: '#C08B5C', marginBottom: '10px', textAlign: 'right' }}>
                {1000 - subtotal > 0 ? `${(1000 - subtotal).toFixed(2)} TL daha ekleyin, kargo bedava olsun!` : ''}
              </div>
            )}

            {/* Kupon Alanı */}
            <div className="coupon-section">
              <input
                type="text"
                placeholder="Kupon Kodu"
                className="coupon-input"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button className="coupon-btn" onClick={handleApplyCoupon}>Uygula</button>
            </div>

            {discount > 0 && (
              <div className="summary-row discount-row">
                <span>İndirim ({appliedCoupon})</span>
                <span>-{discount.toFixed(2)} TL</span>
              </div>
            )}

            <div className="summary-total">
              <span>Ödenecek Tutar</span>
              <span>{totalPayable.toFixed(2)} TL</span>
            </div>

            {/* Sözleşme Onayı Checkbox */}
            <div className="agreement-section">
              <label className="agreement-label">
                <input
                  type="checkbox"
                  checked={isAgreementChecked}
                  onChange={(e) => setIsAgreementChecked(e.target.checked)}
                />
                <span>
                  <span
                    onClick={() => setIsModalOpen(true)}
                    style={{ color: '#C08B5C', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Mesafeli Satış Sözleşmesi
                  </span>'ni okudum ve onaylıyorum.
                </span>
              </label>
            </div>

            <button
              className={`checkout-btn ${!isAgreementChecked ? 'disabled' : ''}`}
              onClick={handleCheckout}
              disabled={!isAgreementChecked}
            >
              SATIN AL
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Mesafeli Satış Sözleşmesi</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>MADDE 1 – TARAFLAR</strong></p>
              <p>İşbu Sözleşme aşağıdaki taraflar arasında aşağıda belirtilen hüküm ve şartlar çerçevesinde imzalanmıştır.</p>
              <p><strong>ALICI:</strong> (Bundan sonra ALICI olarak anılacaktır)</p>
              <p><strong>SATICI:</strong> (Bundan sonra SATICI olarak anılacaktır)</p>
              <p>Adres: Örnek Mahallesi, Örnek Sokak No:1, İstanbul</p>
              <br />
              <p><strong>MADDE 2 – KONU</strong></p>
              <p>İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait internet sitesinden elektronik ortamda siparişini yaptığı aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.</p>
              <br />
              <p><strong>MADDE 3 – SÖZLEŞME KONUSU ÜRÜN</strong></p>
              <p>Ürünlerin Cinsi ve türü, Miktarı, Marka/Modeli, Rengi, Satış Bedeli yukarıda belirtildiği gibidir.</p>
              <br />
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
            <div className="modal-footer">
              <button className="modal-ok-btn" onClick={() => setIsModalOpen(false)}>Tamam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
