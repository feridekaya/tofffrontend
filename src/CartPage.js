// frontend/src/CartPage.js
import React from 'react';
import './CartPage.css'; 
import { Link } from 'react-router-dom';

// Prop olarak 'cart' ve 'setCart' alıyoruz (değişiklik yok)
function CartPage({ cart, setCart }) {

  // Ürünü kaldırma fonksiyonu (değişiklik yok)
  const handleRemoveFromCart = (productIdToRemove) => {
    const updatedCart = cart.filter(item => item.product.id !== productIdToRemove);
    setCart(updatedCart);
  };

  // YENİ FONKSİYON: Adet (quantity) değiştirme
  const handleQuantityChange = (productId, newQuantity) => {
    // Gelen 'newQuantity' değeri string (metin) olabilir, sayıya (integer) çeviriyoruz
    const quantityNum = parseInt(newQuantity);

    // Eğer seçilen sayı 0'dan büyükse (1, 2, 3...)
    if (quantityNum > 0) {
      // Sepetin bir kopyasını (.map) oluştur
      const updatedCart = cart.map(item => {
        // ID'si eşleşen ürünü bul
        if (item.product.id === productId) {
          // O ürünün miktarını yeni sayıyla değiştir
          return { ...item, quantity: quantityNum }; 
        }
        return item; // Diğer ürünlere dokunma
      });
      setCart(updatedCart); // Global sepeti güncelle
    }
    // (Opsiyonel: 0 seçilirse ürünü kaldırabiliriz, 
    // ama şimdilik menüde 0 yok)
  };

  // Toplam fiyat hesaplaması (değişiklik yok)
  const totalPrice = cart.reduce((total, item) => {
    return total + (parseFloat(item.product.price) * item.quantity);
  }, 0);

  // Resim URL fonksiyonu (değişiklik yok)
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
                <div key={item.product.id} className="cart-item">
                  
                  <div className="cart-item-image">
                    <img src={getImageUrl(item.product)} alt={item.product.name} />
                  </div>

                  <div className="cart-item-info">
                    <h3>{item.product.name} (x{item.quantity})</h3>
                    <p>{(parseFloat(item.product.price) * item.quantity).toFixed(2)} TL</p>
                    
                    {/* === JSX GÜNCELLEMESİ BURADA === */}
                    {/* Eski "Adet: {item.quantity}" yazısı yerine bu <select> geldi */}
                    <div className="item-quantity-updater">
                      <label htmlFor={`quantity-${item.product.id}`}>Adet: </label>
                      <select
                        id={`quantity-${item.product.id}`}
                        className="quantity-select"
                        value={item.quantity} // Değeri sepet state'inden al
                        // Değiştiğinde (onChange) handleQuantityChange fonksiyonunu çağır
                        onChange={(e) => handleQuantityChange(item.product.id, e.target.value)} 
                      >
                        {/* 1'den 10'a kadar seçenekler oluşturalım */}
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <button 
                      className="remove-item-btn"
                      onClick={() => handleRemoveFromCart(item.product.id)}
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
            {/* ... (özet kutusu aynı) ... */}
            <div className="summary-total">
              <span>Ödenecek Tutar</span>
              <span>{totalPrice.toFixed(2)} TL</span>
            </div>
            <button className="checkout-btn">SATIN AL</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;