/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // TOFF Design System
                'toff-bg': '#161616',
                'toff-bg-2': '#1F1F1F',
                'toff-bg-3': '#242424',
                'toff-border': '#2e2e2e',
                'toff-border-2': '#333333',
                'toff-text': '#EDEDED',
                'toff-muted': '#9CA3AF',
                'toff-faint': '#525252',
                'toff-accent': '#C08B5C',
                'toff-accent-2': '#E8B07A',
                'toff-accent-3': '#A0714A',
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
            animation: {
                'fade-up': 'fadeInUp 0.4s ease',
                'spin-slow': 'spin 0.8s linear infinite',
            },
            keyframes: {
                fadeInUp: {
                    from: { opacity: '0', transform: 'translateY(12px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};
