// frontend/src/MyOrders.js
import React, { useState } from 'react';

function MyOrders() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div>
      <h2>Siparişlerim</h2>
      
      {/* Görseldeki gibi tablar (sekmeler) */}
      <div className="order-tabs">
        <button
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          Tümü
        </button>
        <button
          className={activeTab === 'delivered' ? 'active' : ''}
          onClick={() => setActiveTab('delivered')}
        >
          Teslim Edilenler
        </button>
        <button
          className={activeTab === 'ongoing' ? 'active' : ''}
          onClick={() => setActiveTab('ongoing')}
        >
          Devam Edenler
        </button>
      </div>
      
      {/* İçerik alanı */}
      <div className="order-content">
        {/* TODO: Buraya sipariş listesi gelecek */}
        <p>Henüz siparişiniz bulunmamaktadır.</p>
      </div>
    </div>
  );
}

export default MyOrders;