// src/pages/NotFoundPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <div className="notfound-code">404</div>
                <h1 className="notfound-title">Sayfa Bulunamadı</h1>
                <p className="notfound-desc">
                    Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
                </p>
                <div className="notfound-actions">
                    <Link to="/" className="notfound-btn primary">
                        Ana Sayfaya Dön
                    </Link>
                    <button className="notfound-btn secondary" onClick={() => navigate(-1)}>
                        Önceki Sayfaya Dön
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
