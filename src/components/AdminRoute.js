// src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * JWT token içindeki is_staff flag'ini decode ederek admin yetkisi kontrol eder.
 * Giriş yapılmamışsa /login'e, yetkisi yoksa /'ye yönlendirir.
 *
 * Kullanım:
 *   <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
 */
function AdminRoute({ children }) {
    const { authTokens } = useAuth();

    if (!authTokens) {
        return <Navigate to="/login" replace />;
    }

    // JWT payload'ını decode et (base64)
    let isAdmin = false;
    try {
        const payload = JSON.parse(atob(authTokens.access.split('.')[1]));
        isAdmin = payload.is_staff === true;
    } catch (e) {
        console.error('Token decode hatası:', e);
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;
