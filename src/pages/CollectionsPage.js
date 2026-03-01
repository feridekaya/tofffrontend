import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

function CollectionsPage() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/collections/`)
            .then(res => { setCollections(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-toff-bg">

            {/* Banner */}
            <div className="relative h-48 sm:h-64 overflow-hidden">
                <img
                    src="/assets/koleksiyonlar-header.webp"
                    alt="Koleksiyonlar"
                    className="w-full h-full object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-toff-bg via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-8">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-[0.25em] text-white drop-shadow-lg">KOLEKSİYONLAR</h1>
                </div>
            </div>

            {/* Liste */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                {loading ? (
                    <div className="flex items-center justify-center h-48 text-toff-muted gap-3">
                        <div className="w-8 h-8 border-2 border-toff-border border-t-toff-accent rounded-full animate-spin" />
                        Yükleniyor...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {collections.map(col => (
                            <Link
                                key={col.id}
                                to={`/koleksiyon/${col.slug}`}
                                className="group relative h-64 sm:h-72 overflow-hidden rounded-xl block"
                            >
                                <div
                                    className="absolute inset-0 bg-center bg-cover transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url('${col.image || `/assets/collection-${col.slug}.webp`}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-6">
                                    <h2 className="text-xl font-bold text-white mb-1">{col.name}</h2>
                                    {col.description && (
                                        <p className="text-sm text-white/70 line-clamp-2">{col.description}</p>
                                    )}
                                    <span className="inline-block mt-3 text-xs font-bold text-toff-accent tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        KEŞFEDİN →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CollectionsPage;
