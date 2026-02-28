import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { useUI } from '../../context/UIContext';

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

    if (!uid || !token) {
        return (
            <div className="min-h-screen bg-toff-bg flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center bg-toff-bg-2 border border-toff-border rounded-xl p-10 shadow-2xl">
                    <div className="text-4xl mb-4">🔗</div>
                    <h2 className="text-lg font-semibold text-toff-text mb-3">Geçersiz Bağlantı</h2>
                    <p className="text-sm text-toff-muted mb-6">
                        Şifre sıfırlama bağlantısı geçersiz veya eksik. Lütfen&nbsp;
                        <Link to="/forgot-password" className="text-toff-accent hover:text-toff-accent-2 font-semibold transition-colors">
                            Şifremi Unuttum
                        </Link>
                        &nbsp;sayfasından yeni bir bağlantı talep edin.
                    </p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            showToast('Şifreler eşleşmiyor.', true);
            return;
        }
        if (password.length < 8) {
            showToast('Şifre en az 8 karakter olmalıdır.', true);
            return;
        }
        setLoading(true);
        try {
            await authService.resetPasswordConfirm(uid, token, password, passwordConfirm);
            setSuccess(true);
            showToast('Şifreniz başarıyla sıfırlandı!');
        } catch (err) {
            showToast(err.response?.data?.error || 'Şifre sıfırlama başarısız oldu. Bağlantı süresi dolmuş olabilir.', true);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-toff-bg flex items-center justify-center px-4">
                <div className="w-full max-w-md animate-fade-up text-center bg-toff-bg-2 border border-toff-border rounded-xl p-10 shadow-2xl">
                    <div className="text-5xl mb-4">🎉</div>
                    <h2 className="text-xl font-semibold text-green-400 mb-3">Şifreniz Sıfırlandı!</h2>
                    <p className="text-sm text-toff-muted mb-6">Yeni şifrenizle giriş yapabilirsiniz.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-toff-accent hover:bg-toff-accent-3 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-sm"
                    >
                        Giriş Yap
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-toff-bg flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md animate-fade-up">

                <div className="text-center mb-8">
                    <span className="text-3xl font-black tracking-[0.3em] text-toff-accent">TOFF</span>
                    <h1 className="text-xl font-semibold text-toff-text mt-2">Yeni Şifre Belirle</h1>
                    <p className="text-sm text-toff-muted mt-1">Lütfen yeni şifrenizi girin.</p>
                </div>

                <div className="bg-toff-bg-2 border border-toff-border rounded-xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-toff-muted uppercase tracking-wider mb-2">
                                Yeni Şifre
                            </label>
                            <input
                                id="password" type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required minLength={8}
                                className="w-full bg-toff-bg border border-toff-border-2 text-toff-text rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-toff-accent transition-colors"
                                placeholder="En az 8 karakter"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-toff-muted uppercase tracking-wider mb-2">
                                Yeni Şifre (Tekrar)
                            </label>
                            <input
                                id="passwordConfirm" type="password" value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                required minLength={8}
                                className="w-full bg-toff-bg border border-toff-border-2 text-toff-text rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-toff-accent transition-colors"
                                placeholder="Şifrenizi tekrar girin"
                            />
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-toff-accent hover:bg-toff-accent-3 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm tracking-wide"
                        >
                            {loading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default ResetPasswordPage;
