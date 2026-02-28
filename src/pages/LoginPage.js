import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { handleLoginSuccess } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/token/`, { username: email, password });
      handleLoginSuccess(response.data);
      navigate(from, { replace: true });
    } catch (err) {
      let detail = err.response?.data?.detail || err.response?.data?.error;
      if (detail === 'No active account found with the given credentials') {
        detail = 'E-posta veya şifre hatalı.';
      }
      setError(detail || 'E-posta veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-toff-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-black tracking-[0.3em] text-toff-accent">TOFF</span>
          <h1 className="text-xl font-semibold text-toff-text mt-2">Giriş Yap</h1>
          <p className="text-sm text-toff-muted mt-1">Hesabınıza hoş geldiniz</p>
        </div>

        {/* Form Card */}
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
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-toff-bg border border-toff-border-2 text-toff-text rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-toff-accent transition-colors"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-toff-muted uppercase tracking-wider mb-2">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-toff-bg border border-toff-border-2 text-toff-text rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-toff-accent transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs text-toff-muted hover:text-toff-accent transition-colors"
              >
                Şifremi Unuttum
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-toff-accent hover:bg-toff-accent-3 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm tracking-wide"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <p className="text-center text-sm text-toff-muted mt-6">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="text-toff-accent hover:text-toff-accent-2 font-semibold transition-colors">
              Ücretsiz Kayıt Ol
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
