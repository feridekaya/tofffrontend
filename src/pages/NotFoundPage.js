// src/pages/NotFoundPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 animate-fade-up">
            <div className="text-center">
                {/* 404 Büyük Yazısı */}
                <div className="text-[8rem] sm:text-[12rem] font-black text-toff-border leading-none select-none">
                    404
                </div>

                <div className="w-16 h-0.5 bg-toff-accent mx-auto mb-6" />

                <h1 className="text-2xl font-bold text-toff-text mb-3">Sayfa Bulunamadı</h1>
                <p className="text-toff-muted text-sm mb-10 max-w-sm mx-auto">
                    Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="bg-toff-accent hover:bg-toff-accent-3 text-white font-bold text-sm px-8 py-3 rounded-lg transition-colors tracking-wider"
                    >
                        Ana Sayfaya Dön
                    </Link>
                    <button
                        onClick={() => navigate(-1)}
                        className="border border-toff-border text-toff-muted hover:border-toff-accent hover:text-toff-accent font-bold text-sm px-8 py-3 rounded-lg transition-colors"
                    >
                        Önceki Sayfaya Dön
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
