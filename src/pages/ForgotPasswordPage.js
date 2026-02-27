import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import '../AuthForm.css';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-logo">TOFF</div>
                <h2>Şifremi Unuttum</h2>
                <p className="auth-subtitle">
                    E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.
                </p>

                {sent ? (
                    <div className="success-message">
                        ✓ E-posta gönderildi. Gelen kutunuzu kontrol edin.
                    </div>
                ) : (
                    <>
                        {error && <p className="error-message">{error}</p>}

                        <div className="form-group">
                            <label htmlFor="email">E-posta</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                        </button>
                    </>
                )}

                <div className="auth-footer">
                    <Link to="/login" style={{ color: '#C08B5C' }}>← Giriş Yap</Link>
                </div>
            </form>
        </div>
    );
}

export default ForgotPasswordPage;
