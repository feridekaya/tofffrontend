import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './HomepageHeader.css';

function HomepageHeader() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                // Scrolling up or at top
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <header className={`homepage-header ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="homepage-header-content">
                {/* Logo */}
                <Link to="/" className="homepage-logo">
                    TOFF
                </Link>

                {/* Navigation Links */}
                <nav className="homepage-nav">
                    <NavLink to="/koleksiyonlar" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>KOLEKSİYONLAR</NavLink>
                    <NavLink to="/tum-urunler" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Mağaza</NavLink>
                    <NavLink to="/hakkimizda" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Hakkımızda</NavLink>
                </nav>
            </div>
        </header>
    );
}

export default HomepageHeader;

