import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const [isVisible, setIsVisible] = useState(false);

    // Sayfa geçişlerinde otomatik yukarı scroll
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // Scroll pozisyonuna göre buton görünürlüğü
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Manuel scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="scroll-to-top">
            {isVisible && (
                <div onClick={scrollToTop} style={styles.button}>
                    <FaArrowUp />
                </div>
            )}
        </div>
    );
};

const styles = {
    button: {
        position: 'fixed',
        bottom: '40px',
        right: '40px',
        backgroundColor: '#C08B5C',
        color: '#fff',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(192, 139, 92, 0.3)',
        fontSize: '1.2rem',
        transition: 'all 0.3s ease',
    }
};

export default ScrollToTop;

