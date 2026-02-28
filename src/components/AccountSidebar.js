// frontend/src/components/AccountSidebar.js
import React from 'react';
import { FaShoppingBag, FaUndo, FaMapMarkerAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { key: 'orders', icon: <FaShoppingBag size={14} />, label: 'Siparişlerim' },
  { key: 'returns', icon: <FaUndo size={13} />, label: 'İptal / İade' },
  { key: 'addresses', icon: <FaMapMarkerAlt size={14} />, label: 'Adreslerim' },
  { key: 'userInfo', icon: <FaUser size={13} />, label: 'Kullanıcı Bilgilerim' },
];

function AccountSidebar({ activeView, setActiveView }) {
  const { handleLogout: onLogout } = useAuth();

  return (
    <nav className="bg-toff-bg-2 border border-toff-border rounded-xl overflow-hidden">
      {NAV_ITEMS.map(item => (
        <button
          key={item.key}
          onClick={() => setActiveView(item.key)}
          className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-b border-toff-border/50 last:border-b-0
            ${activeView === item.key
              ? 'bg-toff-accent/10 text-toff-accent border-l-2 border-l-toff-accent'
              : 'text-toff-muted hover:bg-toff-bg-3 hover:text-toff-text'
            }`}
        >
          <span className="shrink-0">{item.icon}</span>
          {item.label}
        </button>
      ))}
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-900/10 transition-colors"
      >
        <FaSignOutAlt size={14} /> Çıkış Yap
      </button>
    </nav>
  );
}

export default AccountSidebar;
