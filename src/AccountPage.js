// frontend/src/AccountPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './AccountPage.css';

import AccountSidebar from './AccountSidebar';
import MyOrders from './MyOrders';
import MyReturns from './MyReturns';
import MyAddresses from './MyAddresses';
import MyUserInfo from './MyUserInfo';
import UpdatePassword from './UpdatePassword';

function AccountPage({ authTokens, onLogout }) {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get('view') || 'orders';

  const [activeView, setActiveView] = useState(initialView);

  useEffect(() => {
    if (!authTokens) {
      console.log("Kullanıcı giriş yapmamış, /login sayfasına yönlendiriliyor.");
      navigate('/login');
    }
  }, [authTokens, navigate]);

  const renderContent = () => {
    switch (activeView) {
      case 'orders':
        return <MyOrders />;
      case 'returns':
        return <MyReturns />;
      case 'addresses':
        return <MyAddresses />;
      case 'userInfo':
        return (
          <>
            <MyUserInfo authTokens={authTokens} />
            <UpdatePassword authTokens={authTokens} />
          </>
        );
      default:
        return <MyOrders />;
    }
  };

  if (!authTokens) {
    return null;
  }

  return (
    <div className="account-page-container">
      <AccountSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={onLogout}
      />
      <main className="account-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default AccountPage;
