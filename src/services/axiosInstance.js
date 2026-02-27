// src/services/axiosInstance.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: her isteğe JWT ekle ─────────────────────────────────
axiosInstance.interceptors.request.use(
    (config) => {
        const stored = localStorage.getItem('authTokens');
        if (stored) {
            try {
                const tokens = JSON.parse(stored);
                if (tokens?.access) {
                    config.headers['Authorization'] = `Bearer ${tokens.access}`;
                }
            } catch (_) { }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor: 401 → logout ───────────────────────────────────────
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token geçersiz veya süresi dolmuş → temizle
            localStorage.removeItem('authTokens');
            // Giriş sayfasına yönlendir (window.location kullanıyoruz çünkü
            // burada React Router context'i yok)
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
