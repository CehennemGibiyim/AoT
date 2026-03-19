# Albion Online Tools

Kapsamlı Albion Online araç seti - Market fiyatları, harita verileri, crafting hesaplayıcı ve profit calculator.

## 🌟 Özellikler

### 📊 Market Fiyatları
- Gerçek zamanlı eşya fiyatları
- Şehir bazlı fiyat karşılaştırması
- Altın fiyat takibi
- Fiyat geçmişi grafikleri
- Kalite seviyelerine göre filtreleme

### 🗺️ Harita Verileri
- Tüm bölgelerin detaylı listesi
- Kaynak bonusları (Wood, Ore, Fiber, Hide, Rock)
- Tier seviyelerine göre filtreleme (T4-T8)
- Bölge tipleri (Safe, Yellow, Red, Black)
- Mist haritaları hariç
- En iyi kaynak bölgeleri

### ⚒️ Crafting & Eşyalar
- Tüm eşya veritabanı
- Kategoriye göre gruplama (Weapons, Armor, Tools, Resources)
- Crafting tarifleri ve maliyet hesaplamaları
- Eşya detayları ve özellikleri
- Popüler eşyalar listesi

### 💰 Profit Calculator
- Crafting profit hesaplayıcı
- Focus kullanım optimizasyonu
- Resource refining profit
- Transit (şehirler arası ticaret) fırsatları
- Crafting queue yönetimi
- Real-time profit takibi

## 🚀 Kurulum

### GitHub Pages'e Yükleme

1. **Repo Oluşturma:**
   ```bash
   git clone https://github.com/KULLANICI_ADINIZ/AlbionOnlineTools.git
   cd AlbionOnlineTools
   ```

2. **GitHub Pages Ayarları:**
   - GitHub reposunda `Settings > Pages` gidin
   - `Source: Deploy from a branch > main > / (root)` seçin
   - `Save` butonuna tıklayın

3. **Site Erişimi:**
   - Birkaç dakika sonra site yayınlanır
   - `https://KULLANICI_ADINIZ.github.io/AlbionOnlineTools` adresinden erişin

### Lokal Çalıştırma

```bash
# Proje klasörüne gidin
cd AlbionOnlineTools

# Lokal sunucu başlatın (Python 3)
python -m http.server 8000

# Veya Node.js ile
npx serve .

# Tarayıcıda açın
http://localhost:8000
```

## 📁 Proje Yapısı

```
AlbionOnlineTools/
├── index.html              # Ana sayfa
├── css/
│   └── style.css          # Ana stil dosyası
├── js/
│   ├── api.js             # API entegrasyonu
│   ├── maps.js            # Harita verileri
│   ├── items.js           # Eşya veritabanı
│   ├── calculator.js      # Profit hesaplayıcı
│   └── app.js             # Ana uygulama mantığı
├── data/
│   ├── locations.json     # Bölge verileri (GitHub'dan)
│   └── items.json         # Eşya verileri (GitHub'dan)
├── assets/
│   └── images/            # İkonlar ve görseller
└── README.md              # Bu dosya
```

## 🔧 API Kaynakları

### Albion Online Data Project API
- **Base URL:** `https://www.albion-online-data.com/api/v2/`
- **Endpoints:**
  - `/stats/prices/{item_ids}.json` - Eşya fiyatları
  - `/stats/gold.json` - Altın fiyatları
  - `/stats/history/{item_id}.json` - Fiyat geçmişi

### GameInfo API (Resmi)
- **Base URL:** `https://gameinfo.albiononline.com/api/gameinfo/`
- **Endpoints:**
  - `/items/{itemId}/data` - Eşya detayları
  - `/events` - Olaylar/Killboard

### Render API
- **Base URL:** `https://render.albiononline.com/v1/`
- **Endpoints:**
  - `/item/{itemId}.png` - Eşya ikonları

### Static Data
- **GitHub:** `ao-data/ao-bin-dumps`
- **Dosyalar:**
  - `world.txt` - Tüm harita verileri
  - `items.txt` - Tüm eşya verileri

## 🎮 Kullanım

### Market Fiyatları
1. **Market** sekmesine gidin
2. Arama kutusuna eşya adını yazın
3. Şehir ve kalite filtrelerini kullanın
4. Hızlı arama butonları ile popüler eşyalara erişin

### Harita Verileri
1. **Maps** sekmesine gidin
2. Bölge listesini, istatistikleri veya en iyi kaynak bölgelerini görüntüleyin
3. Filtreleri kullanarak istediğiniz bölgeleri bulun
4. Tier ve tip bazında filtreleme yapın

### Crafting
1. **Crafting** sekmesine gidin
2. Kategoriler arasından seçim yapın
3. Eşya araması yapın veya popüler eşyalara göz atın
4. Eşya detaylarını ve crafting tariflerini inceleyin

### Profit Calculator
1. **Profit Calc** sekmesine gidin
2. Crafting calculator'da eşya seçin ve profit hesaplayın
3. Popular items, resource refining veya transit opportunities seçeneklerini kullanın
4. Crafting queue'ye ekleyerek multiple hesaplamalar yapın

## ⌨️ Kısayollar

- `Ctrl+1` - Market sekmesi
- `Ctrl+2` - Maps sekmesi  
- `Ctrl+3` - Crafting sekmesi
- `Ctrl+4` - Profit Calculator sekmesi

## 🔧 Özellikler

### Auto-Refresh
- Market verileri 5 dakikada bir otomatik yenilenir
- Altın fiyatları gerçek zamanlı takip edilir

### Responsive Design
- Mobil uyumlu arayüz
- Tablet ve masaüstü optimizasyonu
- Touch-friendly kontroller

### Error Handling
- API hatalarında kullanıcı dostu mesajlar
- Fallback veriler ile kesintisiz kullanım
- Loading durumları ve progress göstergeleri

## 🤝 Katkıda Bulunma

1. Repo'yu fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişiklikleri commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'e push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında yayınlanmıştır. Detaylar için `LICENSE` dosyasını inceleyin.

## 🙏 Teşekkürler

- [Albion Online Data Project](https://www.albion-online-data.com/) - API verileri için
- [ao-data/ao-bin-dumps](https://github.com/ao-data/ao-bin-dumps) - Static veriler için
- Albion Online geliştiricileri ve topluluğu

## 📞 İletişim

Sorular, öneriler veya hata bildirimleri için:
- GitHub Issues kullanın
- Discord: [Link]
- Email: [Email]

---

**Made with ❤️ for Albion Online Community**
