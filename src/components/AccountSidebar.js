// frontend/src/components/AccountSidebar.js
import React from 'react';
import { useAuth } from '../context/AuthContext';

function AccountSidebar({ activeView, setActiveView }) {
  const { handleLogout: onLogout } = useAuth();
  return (
    <aside className="account-sidebar">
      <nav>
        <ul>
          <li>
            <button
              className={activeView === 'orders' ? 'active' : ''}
              onClick={() => setActiveView('orders')}
            >
              {/* <FaBox /> */} {/* İkonlar sonradan eklenebilir */}
              Siparişlerim
            </button>
          </li>
          <li>
            <button
              className={activeView === 'returns' ? 'active' : ''}
              onClick={() => setActiveView('returns')}
            >
              {/* <FaUndo /> */}
              İptal/İade
            </button>
          </li>
          <li>
            <button
              className={activeView === 'addresses' ? 'active' : ''}
              onClick={() => setActiveView('addresses')}
            >
              {/* <FaMapMarkerAlt /> */}
              Adreslerim
            </button>
          </li>
          <li>
            <button
              className={activeView === 'userInfo' ? 'active' : ''}
              onClick={() => setActiveView('userInfo')}
            >
              {/* <FaUser /> */}
              Kullanıcı Bilgilerim
            </button>
          </li>
          <li>
            <button className="logout-btn" onClick={onLogout}>
              {/* <FaSignOutAlt /> */}
              Çıkış Yap
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default AccountSidebar;
