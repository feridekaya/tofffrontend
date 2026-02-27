// src/components/PublicOnlyRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Zaten giriş yapmış kullanıcıların login/register gibi
 * sayfalara erişimini engeller.
 * Giriş yapılmışsa: state.from varsa oraya, yoksa /'ye yönlendirir.
 *
 * Kullanım:
 *   <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
 */
function PublicOnlyRoute({ children }) {
    const { authTokens } = useAuth();
    const location = useLocation();

    if (authTokens) {
        const redirectTo = location.state?.from?.pathname || '/';
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}

export default PublicOnlyRoute;
