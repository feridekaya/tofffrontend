# API URL Güncelleme Rehberi

## 🎯 Sorun
Frontend kodunda API URL'leri hardcoded (`http://127.0.0.1:8000`) olarak yazılmış durumda. Production'da bu URL'lerin dinamik olması gerekiyor.

## ✅ Çözüm: Environment Variables

### Hazırlık (Tamamlandı)
- ✅ `src/config/api.js` dosyası oluşturuldu
- ✅ `.env.production` dosyası oluşturuldu

### Deployment Sırasında Yapılacaklar

#### 1. Vercel'de Environment Variable Ekleyin

Vercel dashboard'da:
1. Project Settings → Environment Variables
2. Yeni variable ekleyin:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://your-backend.up.railway.app` (Railway'den alacağınız URL)
   - **Environment:** Production

#### 2. Redeploy Edin

Environment variable ekledikten sonra:
- Vercel otomatik redeploy yapacak
- VEYA manuel olarak: `vercel --prod`

### Alternatif: Dosyaları Manuel Güncelleme

Eğer tüm dosyaları şimdi güncellemek isterseniz, aşağıdaki 21 dosyada değişiklik yapılması gerekiyor:

**Güncellenecek Dosyalar:**
1. App.js (3 yer)
2. CartPage.js (1 yer)
3. CheckoutPage.js (1 yer)
4. CategoryPage.js (1 yer)
5. AnaSayfa.js (1 yer)
6. CollectionPage.js (2 yer)
7. CollectionsPage.js (1 yer)
8. Header.js (1 yer)
9. OffCanvasSidebar.js (1 yer)
10. ProductDetailPage.js (1 yer)
11. LoginPage.js (1 yer)
12. RegisterPage.js (1 yer)
13. MyUserInfo.js (1 yer)
14. MyAddresses.js (4 yer)
15. UpdatePassword.js (1 yer)

**Her dosyada yapılacak değişiklik:**

```javascript
// Önce (eski)
import axios from 'axios';

axios.get('http://127.0.0.1:8000/api/products/')

// Sonra (yeni)
import axios from 'axios';
import API_BASE_URL from './config/api';

axios.get(`${API_BASE_URL}/api/products/`)
```

## 🚀 Önerilen Yöntem

**Şimdilik:** Vercel environment variable kullanın (yukarıdaki adım 1-2)
- ✅ Hızlı
- ✅ Kod değişikliği gerektirmez
- ✅ Test için yeterli

**İlerleyen zamanlarda:** Dosyaları manuel güncelleyin
- ✅ Daha temiz kod
- ✅ Local development'ta da çalışır
- ⚠️ 21 dosyada değişiklik gerektirir

## 📝 Notlar

- Environment variable her zaman kod değişikliğinden önceliklidir
- `.env.production` dosyası zaten hazır
- `config/api.js` dosyası environment variable'ı otomatik okur
- Localhost'ta çalışırken otomatik `http://127.0.0.1:8000` kullanır
