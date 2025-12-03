// frontend/src/ShippingReturnPage.js
import { FaTruck } from 'react-icons/fa';

const styles = {
    container: {
        padding: '80px 20px',
        maxWidth: '1100px',
        margin: '0 auto',
        backgroundColor: '#161616',
        color: '#9CA3AF',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '20px',
    },
    title: {
        fontSize: '2rem',
        color: '#EDEDED',
        margin: 0,
    },
    text: {
        fontSize: '1rem',
        color: '#9CA3AF',
    },
};

function ShippingReturnPage() {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <FaTruck size={48} color="#C08B5C" />
                <h1 style={styles.title}>Ücretsiz Kargo ve İade</h1>
            </div>
            <p style={styles.text}>Kargo ve iade bilgileri buraya gelecek.</p>
        </div>
    );
}

export default ShippingReturnPage;

