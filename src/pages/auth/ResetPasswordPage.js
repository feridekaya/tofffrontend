import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { useUI } from '../../context/UIContext';
import '../../AuthForm.css';

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useUI();
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Link eksikse veya hatalıysa baştan engelle
    if (!uid || !token) {
        return (
            <div className="auth-container">
                <div className="auth-form" style={{ textAlign: 'center' }}>
                    <h2>Geçersiz Bağlantı</h2>
                    <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>
                        Şifre sıfırlama bağlantısı geçersiz veya eksik. Lütfen "Şifremi Unuttum" sayfasından yeni bir bağlantı talep edin.
                    </p>
                    <Link to="/forgot-password" style={{ color: '#C08B5C', fontWeight: 600 }}>← Şifremi Unuttum</Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            showToast("Şifreler eşleşmiyor.", true);
            return;
        }

        if (password.length < 8) {
            showToast("Şifre en az 8 karakter olmalıdır.", true);
            return;
        }

        setLoading(true);

        try {
            await authService.resetPasswordConfirm(uid, token, password, passwordConfirm);
            setSuccess(true);
            showToast("Şifreniz başarıyla sıfırlandı!");
        } catch (err) {
            showToast(err.response?.data?.error || "Şifre sıfırlama başarısız oldu. Link süresi dolmuş olabilir.", true);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-form" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#4ade80' }}>Şifreniz Sıfırlandı! 🎉</h2>
                    <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>
                        Yeni şifrenizle giriş yapabilirsiniz.
                    </p>
                    <button onClick={() => navigate('/login')} className="auth-button">
                        Giriş Yap
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-logo">TOFF</div>
                <h2>Yeni Şifre Belirle</h2>
                <p className="auth-subtitle">
                    Lütfen yeni şifrenizi girin.
                </p>

                <div className="form-group">
                    <label htmlFor="password">Yeni Şifre</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="passwordConfirm">Yeni Şifre (Tekrar)</label>
                    <input
                        type="password"
                        id="passwordConfirm"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                        minLength={8}
                    />
                </div>

                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
                </button>
            </form>
        </div>
    );
}

export default ResetPasswordPage;
