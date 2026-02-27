// src/context/AuthContext.js
// Sadece kimlik doğrulama state'ini tutar.
// Cart ve Favorites → CartContext'e taşındı.
import React, { createContext, useContext, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [authTokens, setAuthTokens] = useState(() => {
        const stored = localStorage.getItem('authTokens');
        return stored ? JSON.parse(stored) : null;
    });

    // Giriş başarılı → token sakla
    const handleLoginSuccess = (tokens) => {
        setAuthTokens(tokens);
        localStorage.setItem('authTokens', JSON.stringify(tokens));
    };

    // Çıkış yap → backend'e bildir, token temizle
    const handleLogout = async () => {
        const stored = localStorage.getItem('authTokens');
        if (stored) {
            try {
                const tokens = JSON.parse(stored);
                await authService.logout(tokens.refresh);
            } catch (err) {
                console.warn('Logout API hatası:', err.message);
            }
        }
        setAuthTokens(null);
        localStorage.removeItem('authTokens');
    };

    // JWT payload'ı decode et (is_staff kontrolü için)
    const getTokenPayload = () => {
        if (!authTokens?.access) return null;
        try {
            return JSON.parse(atob(authTokens.access.split('.')[1]));
        } catch { return null; }
    };

    const isAdmin = getTokenPayload()?.is_staff === true;

    const value = {
        authTokens,
        isAdmin,
        handleLoginSuccess,
        handleLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
