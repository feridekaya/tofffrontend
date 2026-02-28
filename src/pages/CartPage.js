// frontend/src/pages/CartPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import cartService from '../services/cartService';
import couponService from '../services/couponService';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';

function CartPage() {
  const { cart, setCart, authTokens } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const handleRemoveFromCart = async (cartIdToRemove) => {
    if (authTokens) {
      try { await cartService.removeItem(cartIdToRemove); }
      catch { return; }
    }
    setCart(cart.filter(item => item.cartId !== cartIdToRemove));
  };

  const handleQuantityChange = async (cartId, newQuantity) => {
    const q = parseInt(newQuantity);
    if (q > 0) {
      if (authTokens) {
        try { await cartService.updateQuantity(cartId, q); } catch { }
      }
      setCart(cart.map(item => item.cartId === cartId ? { ...item, quantity: q } : item));
    }
  };

  const subtotal = cart.reduce((t, item) => t + parseFloat(item.product.price) * item.quantity, 0);
  const kdvAmount = subtotal - subtotal / 1.2;
  const shippingCost = subtotal >= 1000 ? 0 : 100;
  const totalPayable = subtotal + shippingCost - discount;
  const remaining = 1000 - subtotal;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    try {
      const res = await couponService.validateCoupon(couponCode);
      const data = res.data;
      const disc = subtotal * (data.discount_percent / 100);
      setDiscount(disc);
      setAppliedCoupon(data.code);
    } catch (err) {
      alert(err.response?.data?.error || 'Geçersiz kupon kodu.');
      setDiscount(0); setAppliedCoupon(null);
    } finally { setCouponLoading(false); }
  };

  const handleCheckout = () => {
    if (!isAgreementChecked) {
      alert('Lütfen Mesafeli Satış Sözleşmesini onaylayınız.');
      return;
    }
    navigate('/odeme');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-up">
      <h1 className="text-2xl font-bold text-toff-text tracking-wider mb-8">SEPETİM</h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <FiShoppingBag size={56} className="text-toff-faint" />
          <p className="text-toff-muted text-lg">Sepetinizde henüz ürün bulunmuyor.</p>
          <Link
            to="/"
            className="border border-toff-accent text-toff-accent hover:bg-toff-accent hover:text-white px-8 py-3 text-sm font-bold tracking-widest transition-colors"
          >
            ALIŞVERİŞE DEVAM ET
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Sepet Listesi ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map(item => (
              <div
                key={item.cartId || item.product.id}
                className="flex gap-4 bg-toff-bg-2 border border-toff-border rounded-xl p-4 hover:border-toff-border-2 transition-colors"
              >
                {/* Resim */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-toff-bg-3 rounded-lg overflow-hidden shrink-0">
                  {item.product.image
                    ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-toff-faint text-xs">Görsel yok</div>
                  }
                </div>

                {/* Bilgi */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-toff-text line-clamp-2 mb-1">{item.product.name}</h3>

                  {/* Varyantlar */}
                  <div className="flex flex-wrap gap-3 mb-2">
                    {item.selectedSize && (
                      <span className="text-xs text-toff-faint bg-toff-bg px-2 py-1 rounded">
                        Boyut: <strong className="text-toff-muted">{item.selectedSize.name}</strong>
                      </span>
                    )}
                    {item.selectedColor && (
                      <span className="flex items-center gap-1.5 text-xs text-toff-faint bg-toff-bg px-2 py-1 rounded">
                        Renk:
                        <span className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: item.selectedColor.hex_code }} />
                        <strong className="text-toff-muted">{item.selectedColor.name}</strong>
                      </span>
                    )}
                  </div>

                  <p className="text-toff-accent font-bold text-base mb-3">
                    {(parseFloat(item.product.price) * item.quantity).toLocaleString('tr-TR')} ₺
                  </p>

                  {/* Adet ve Sil */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <label className="text-xs text-toff-faint">Adet:</label>
                      <select
                        value={item.quantity}
                        onChange={e => handleQuantityChange(item.cartId, e.target.value)}
                        className="bg-toff-bg border border-toff-border text-toff-text text-sm rounded px-2 py-1 focus:outline-none focus:border-toff-accent"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.cartId)}
                      className="flex items-center gap-1 text-xs text-toff-faint hover:text-red-400 transition-colors ml-auto"
                    >
                      <FiTrash2 size={13} /> Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Sipariş Özeti ─────────────────────────────────────────── */}
          <div>
            <div className="bg-toff-bg-2 border border-toff-border rounded-xl p-5 sticky top-[80px]">
              <h2 className="text-sm font-bold text-toff-text tracking-widest mb-5 pb-3 border-b border-toff-border uppercase">
                Sipariş Özeti
              </h2>

              <div className="flex flex-col gap-2 text-sm mb-4">
                <div className="flex justify-between text-toff-muted">
                  <span>Ara Toplam</span>
                  <span>{subtotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                </div>
                <div className="flex justify-between text-toff-faint text-xs">
                  <span>KDV (%20 Dahil)</span>
                  <span>{kdvAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                </div>
                <div className="flex justify-between text-toff-muted">
                  <span>Kargo</span>
                  <span className={shippingCost === 0 ? 'text-green-400' : ''}>
                    {shippingCost === 0 ? 'Ücretsiz' : `${shippingCost} ₺`}
                  </span>
                </div>
                {shippingCost > 0 && remaining > 0 && (
                  <p className="text-toff-accent text-[11px] text-right">
                    {remaining.toLocaleString('tr-TR', { minimumFractionDigits: 0 })} ₺ daha ekleyin, kargo bedava!
                  </p>
                )}
              </div>

              {/* Kupon */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Kupon kodu"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-1 bg-toff-bg border border-toff-border text-toff-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-toff-accent transition-colors"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="bg-toff-bg border border-toff-border text-toff-muted hover:border-toff-accent hover:text-toff-accent text-xs font-bold px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {couponLoading ? '...' : 'Uygula'}
                </button>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-400 mb-3">
                  <span>İndirim ({appliedCoupon})</span>
                  <span>-{discount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                </div>
              )}

              {/* Toplam */}
              <div className="flex justify-between text-base font-bold text-toff-text border-t border-toff-border pt-3 mb-5">
                <span>Ödenecek Tutar</span>
                <span className="text-toff-accent">{totalPayable.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
              </div>

              {/* Sözleşme */}
              <label className="flex items-start gap-2 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAgreementChecked}
                  onChange={e => setIsAgreementChecked(e.target.checked)}
                  className="mt-0.5 accent-toff-accent shrink-0"
                />
                <span className="text-xs text-toff-faint leading-relaxed">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-toff-accent underline hover:text-toff-accent-2 transition-colors"
                  >
                    Mesafeli Satış Sözleşmesi
                  </button>
                  'ni okudum ve onaylıyorum.
                </span>
              </label>

              <button
                onClick={handleCheckout}
                disabled={!isAgreementChecked}
                className="w-full bg-toff-accent hover:bg-toff-accent-3 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 tracking-widest text-sm transition-colors rounded-lg"
              >
                SATIN AL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sözleşme Modal ────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-toff-bg-2 border border-toff-border rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-toff-border">
              <h2 className="text-sm font-bold text-toff-text tracking-wider">Mesafeli Satış Sözleşmesi</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-toff-muted hover:text-toff-text text-xl leading-none transition-colors">×</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-toff-muted space-y-4 leading-relaxed">
              <p><strong className="text-toff-text">MADDE 1 – TARAFLAR</strong></p>
              <p>İşbu Sözleşme aşağıdaki taraflar arasında aşağıda belirtilen hüküm ve şartlar çerçevesinde imzalanmıştır.</p>
              <p><strong className="text-toff-text">MADDE 2 – KONU</strong></p>
              <p>İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait internet sitesinden elektronik ortamda siparişini yaptığı ürünlerin satışı ve teslimi ile ilgili 6502 sayılı Kanun hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.</p>
              <p><strong className="text-toff-text">MADDE 3 – ÜRÜN BİLGİLERİ</strong></p>
              <p>Ürünlerin cinsi, miktarı ve satış bedeli sipariş sayfasında belirtildiği gibidir.</p>
            </div>
            <div className="px-6 py-4 border-t border-toff-border flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-toff-accent hover:bg-toff-accent-3 text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
