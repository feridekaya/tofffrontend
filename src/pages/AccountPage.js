// frontend/src/pages/AccountPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AccountPage.css';

import AccountSidebar from '../components/AccountSidebar';
import MyOrders from '../components/account/MyOrders';
import MyReturns from '../components/account/MyReturns';
import MyAddresses from '../components/account/MyAddresses';
import MyUserInfo from '../components/account/MyUserInfo';
import UpdatePassword from '../components/account/UpdatePassword';

function AccountPage() {
  const { authTokens } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeView, setActiveView] = useState(searchParams.get('view') || 'orders');

  useEffect(() => {
    if (!authTokens) navigate('/login');
  }, [authTokens, navigate]);

  const renderContent = () => {
    switch (activeView) {
      case 'orders': return <MyOrders />;
      case 'returns': return <MyReturns />;
      case 'addresses': return <MyAddresses />;
      case 'userInfo': return <><MyUserInfo /><UpdatePassword /></>;
      default: return <MyOrders />;
    }
  };

  if (!authTokens) return null;

  return (
    <div className="account-page-container">
      <AccountSidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="account-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default AccountPage;
