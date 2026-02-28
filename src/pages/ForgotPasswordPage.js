import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

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

    if (sent) {
        return (
            <div className="min-h-screen bg-toff-bg flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md animate-fade-up text-center">
                    <div className="bg-toff-bg-2 border border-toff-border rounded-xl p-10 shadow-2xl">
                        <div className="text-5xl mb-4">📬</div>
                        <h2 className="text-xl font-semibold text-toff-text mb-3">E-posta Gönderildi!</h2>
                        <p className="text-sm text-toff-muted mb-6">
                            <span className="text-toff-accent font-medium">{email}</span> adresine şifre sıfırlama bağlantısı gönderildi.
                            Lütfen gelen kutunuzu kontrol edin.
                        </p>
                        <Link to="/login" className="text-toff-accent hover:text-toff-accent-2 text-sm font-semibold transition-colors">
                            ← Giriş Sayfasına Dön
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-toff-bg flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md animate-fade-up">

                <div className="text-center mb-8">
                    <span className="text-3xl font-black tracking-[0.3em] text-toff-accent">TOFF</span>
                    <h1 className="text-xl font-semibold text-toff-text mt-2">Şifremi Unuttum</h1>
                    <p className="text-sm text-toff-muted mt-1">E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.</p>
                </div>

                <div className="bg-toff-bg-2 border border-toff-border rounded-xl p-8 shadow-2xl">

                    {error && (
                        <div className="mb-5 bg-red-900/30 border border-red-700/50 text-red-400 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-toff-muted uppercase tracking-wider mb-2">
                                E-posta
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-toff-bg border border-toff-border-2 text-toff-text rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-toff-accent transition-colors"
                                placeholder="ornek@email.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-toff-accent hover:bg-toff-accent-3 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm tracking-wide"
                        >
                            {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-toff-muted mt-6">
                        <Link to="/login" className="text-toff-accent hover:text-toff-accent-2 font-semibold transition-colors">
                            ← Giriş Sayfasına Dön
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default ForgotPasswordPage;
