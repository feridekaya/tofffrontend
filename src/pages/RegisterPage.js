import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    phone_number: '', password: '', password2: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.password2) {
      return setError('Şifreler eşleşmiyor.');
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/register/`, {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone_number: form.phone_number,
        password: form.password,
      });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.email?.[0] || data?.password?.[0] || data?.detail || 'Kayıt başarısız.';
      setError(msg);
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
          <h1 className="text-xl font-semibold text-toff-text mt-2">Hesap Oluştur</h1>
          <p className="text-sm text-toff-muted mt-1">Ailemize katılın</p>
        </div>

        <div className="bg-toff-bg-2 border border-toff-border rounded-xl p-8 shadow-2xl">

          {error && (
            <div className="mb-5 bg-red-900/30 border border-red-700/50 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-toff-muted uppercase tracking-wider mb-2">Ad</label>
                <input
                  name="first_name" type="text" value={form.first_name}
                  onChange={handleChange} required
                  className="w-full bg-toff-bg border border-toff-border-2 text-toff-text rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-toff-accent transition-colors"
                  placeholder="Adınız"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-toff-muted uppercase tracking-wider mb-2">Soyad</label>
                <input
                  name="last_name" type="text" value={form.last_name}
                  onChange={handleChange} required
                  className="w-full bg-toff-bg border border-toff-border-2 text-toff-text rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-toff-accent transition-colors"
                  placeholder="Soyadınız"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-toff-muted uppercase tracking-wider mb-2">E-posta</label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} required
                className="w-full bg-toff-bg border border-toff-border-2 text-toff-text rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-toff-accent transition-colors"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-toff-muted uppercase tracking-wider mb-2">Telefon</label>
              <input
                name="phone_number" type="tel" value={form.phone_number}
                onChange={handleChange} required
                className="w-full bg-toff-bg border border-toff-border-2 text-toff-text rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-toff-accent transition-colors"
                placeholder="05XX XXX XX XX"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-toff-muted uppercase tracking-wider mb-2">Şifre</label>
              <input
                name="password" type="password" value={form.password}
                onChange={handleChange} required minLength={8}
                className="w-full bg-toff-bg border border-toff-border-2 text-toff-text rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-toff-accent transition-colors"
                placeholder="En az 8 karakter"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-toff-muted uppercase tracking-wider mb-2">Şifre Tekrar</label>
              <input
                name="password2" type="password" value={form.password2}
                onChange={handleChange} required minLength={8}
                className="w-full bg-toff-bg border border-toff-border-2 text-toff-text rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-toff-accent transition-colors"
                placeholder="Şifrenizi tekrar girin"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-toff-accent hover:bg-toff-accent-3 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm tracking-wide mt-2"
            >
              {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </button>
          </form>

          <p className="text-center text-sm text-toff-muted mt-6">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="text-toff-accent hover:text-toff-accent-2 font-semibold transition-colors">
              Giriş Yap
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;
