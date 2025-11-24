# 🚀 QUICK START GUIDE - SITTA Vue.js

## Langkah Cepat Menjalankan Aplikasi

### 1. Persiapan
✅ Pastikan XAMPP sudah terinstall
✅ Project sudah ada di: `C:\xampp\htdocs\pemesanan-bahan-ajar-SITTA-part3\`

### 2. Start Server
1. Buka XAMPP Control Panel
2. Klik **Start** pada Apache
3. Tunggu hingga status Apache berwarna hijau

### 3. Akses Aplikasi
Buka browser dan akses:
```
http://localhost/pemesanan-bahan-ajar-SITTA-part3/
```

### 4. Login
Gunakan salah satu akun berikut:

**Admin:**
- Email: `admin@ut.ac.id`
- Password: `admin123`

**UPBJJ Jakarta:**
- Email: `rina@ut.ac.id`
- Password: `rina123`

**UPBJJ Makassar:**
- Email: `agus@ut.ac.id`
- Password: `agus123`

---

## 📋 Fitur yang Bisa Dicoba

### 1. Dashboard
✅ Real-time greeting berdasarkan waktu
✅ Navigasi menu dengan Vue.js
✅ Toggle submenu laporan

### 2. Informasi Stok Bahan Ajar
✅ Filter data (search, kategori, UPBJJ)
✅ Sort data (judul, qty, harga)
✅ Tambah stok baru
✅ Edit stok existing
✅ Status badge (Habis/Stok Rendah/Tersedia)

**Cara mencoba:**
1. Klik menu "Informasi Stok Bahan Ajar"
2. Coba filter dengan ketik "EKMA" di search box
3. Pilih kategori "MK Wajib"
4. Klik "Tambah Stok Baru" untuk input data baru
5. Klik tombol edit (pensil) untuk edit stok

### 3. Tracking Pengiriman
✅ Cari tracking dengan nomor DO
✅ Lihat detail pengiriman
✅ Tambah Delivery Order baru
✅ Lihat semua daftar DO

**Cara mencoba:**
1. Klik menu "Tracking Pengiriman"
2. Input nomor DO: `DO2025-0001`
3. Klik "Cari Tracking"
4. Lihat detail tracking dan riwayat perjalanan
5. Klik "Tambah Delivery Order Baru" untuk buat DO baru

---

## 🎯 Vue.js Features yang Diimplementasikan

### ✅ 1. Vue Components
- `<ba-stock-table>` - Tabel stok
- `<do-tracking>` - Tracking results
- `<order-form>` - Form DO baru
- `<status-badge>` - Status badge
- `<app-modal>` - Reusable modal

### ✅ 2. Mustaches & v-text
```vue
{{ userName }}
{{ formatCurrency(harga) }}
<span v-text="timeGreeting"></span>
```

### ✅ 3. Conditional (v-if/v-else/v-show)
```vue
<div v-if="showResults">...</div>
<div v-else>No data</div>
<div v-show="showMenu">...</div>
```

### ✅ 4. Data Binding
```vue
<!-- v-model (two-way) -->
<input v-model="searchQuery">

<!-- v-bind (one-way) -->
<span :class="getClass()"></span>
```

### ✅ 5. Computed Properties
```vue
computed: {
    filteredStok() { /* ... */ },
    nextDONumber() { /* ... */ }
}
```

### ✅ 6. Watchers
```vue
watch: {
    'formData.paketKode'(newVal) {
        // Update total harga
    }
}
```

### ✅ 7. v-for (Array Processing)
```vue
<tr v-for="(item, index) in stokList" :key="item.kode">
    <td>{{ index + 1 }}</td>
    <td>{{ item.judul }}</td>
</tr>
```

### ✅ 8. Data Filtering
```javascript
formatCurrency(value) {
    return 'Rp ' + value.toLocaleString('id-ID');
}

formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID');
}
```

---

## 📁 Struktur File Penting

```
├── index.html                    # Login page (Vue)
├── templates/
│   ├── dashboard.html            # Dashboard (Vue)
│   ├── stok-table.html          # Stok page (Vue)
│   └── do-tracking.html         # Tracking page (Vue)
├── js/
│   ├── app.js                    # Vue root initialization
│   ├── dashboard.js              # Dashboard Vue app
│   ├── stok.js                   # Stok Vue app
│   ├── tracking.js               # Tracking Vue app
│   ├── index.js                  # Login Vue app
│   ├── components/               # Vue components
│   │   ├── stock-table.js
│   │   ├── do-tracking.js
│   │   ├── order-form.js
│   │   ├── status-badge.js
│   │   └── app-modal.js
│   └── services/
│       └── api.js                # Data service
└── assets/
    ├── css/
    │   └── style.css
    └── img/
```

---

## 🔍 Testing Checklist

Coba fitur-fitur berikut untuk memastikan Vue.js berjalan dengan baik:

### Login Page
- [ ] Login dengan kredensial yang benar
- [ ] Login dengan kredensial salah (harus muncul error)
- [ ] Klik "Lupa Password" dan input email
- [ ] Klik "Daftar" dan register user baru

### Dashboard
- [ ] Lihat greeting berubah sesuai waktu
- [ ] Lihat tanggal/waktu update real-time
- [ ] Klik menu "Informasi Stok Bahan Ajar"
- [ ] Klik menu "Tracking Pengiriman"
- [ ] Klik "Laporan" untuk toggle submenu

### Stok Bahan Ajar
- [ ] Search dengan keyword (misal: "EKMA")
- [ ] Filter by kategori
- [ ] Filter by UPBJJ
- [ ] Sort by judul/qty/harga
- [ ] Klik "Tambah Stok Baru"
- [ ] Input data stok baru dan save
- [ ] Edit stok existing
- [ ] Lihat status badge berubah sesuai qty

### Tracking Pengiriman
- [ ] Input nomor DO: `DO2025-0001`
- [ ] Klik "Cari Tracking"
- [ ] Lihat detail tracking muncul
- [ ] Klik "Tambah Delivery Order Baru"
- [ ] Pilih paket bahan ajar
- [ ] Lihat detail paket muncul otomatis
- [ ] Save DO baru
- [ ] Lihat DO baru muncul di tabel

---

## 🐛 Troubleshooting

### Problem: Halaman blank/error
**Solution:**
1. Pastikan Apache sudah running
2. Clear browser cache (Ctrl + Shift + Delete)
3. Buka browser console (F12) dan cek error

### Problem: Vue component tidak muncul
**Solution:**
1. Cek apakah Vue.js CDN sudah loaded
2. Pastikan component files sudah di-include
3. Buka console dan cek error "Component not registered"

### Problem: CSS/Image tidak muncul
**Solution:**
1. Cek path asset (index.html: `assets/`, templates: `../assets/`)
2. Pastikan file benar-benar ada di folder tersebut
3. Refresh browser (Ctrl + F5)

### Problem: Data tidak tersimpan
**Solution:**
1. Data disimpan di sessionStorage (hilang saat browser ditutup)
2. Ini adalah behavior yang normal untuk development
3. Data akan kembali ke default saat reload page

---

## 📞 Support

Jika menemukan masalah:
1. Baca README-VUEJS.md untuk dokumentasi lengkap
2. Cek browser console (F12) untuk error messages
3. Pastikan semua file sudah di-include dengan benar

---

## 🎓 Learning Resources

**Vue.js Documentation:**
- https://v2.vuejs.org/

**Bootstrap Documentation:**
- https://getbootstrap.com/docs/5.3/

**JavaScript MDN:**
- https://developer.mozilla.org/en-US/docs/Web/JavaScript

---

**Happy Coding! 🚀**
