// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Giriş gerektiren sayfalar için wrapper.
 * Giriş yapmamış kullanıcıyı /login'e yönlendirir.
 * Giriş sonrası "from" state'inden geri dönebilir.
 *
 * Kullanım:
 *   <Route path="/hesabim" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
 */
function ProtectedRoute({ children }) {
    const { authTokens } = useAuth();
    const location = useLocation();

    if (!authTokens) {
        // Kullanıcının gitmek istediği sayfayı state olarak kaydet
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;
