// frontend/src/pages/AccountPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
      case 'userInfo': return <MyUserInfo authTokens={authTokens} />;
      case 'password': return <UpdatePassword authTokens={authTokens} />;
      default: return <MyOrders />;
    }
  };

  if (!authTokens) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-up">
      <div className="flex flex-col sm:flex-row gap-6 lg:gap-8">
        {/* Sidebar */}
        <aside className="w-full sm:w-56 shrink-0">
          <AccountSidebar activeView={activeView} setActiveView={setActiveView} />
        </aside>
        {/* İçerik */}
        <main className="flex-1 min-w-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AccountPage;
