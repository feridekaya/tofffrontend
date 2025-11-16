// frontend/src/AccountPage.js
import React from 'react';

function AccountPage() {
  // TODO: Burası "Korumalı" bir sayfa olmalı
  // Eğer kullanıcı giriş yapmamışsa, onu /login sayfasına atmalıyız

  return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <h1>Hesabım</h1>
      <p>Kişisel bilgilerinizi, adreslerinizi ve geçmiş siparişlerinizi buradan yönetebilirsiniz.</p>
    </div>
  );
}

export default AccountPage;
