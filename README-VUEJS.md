# SITTA - Sistem Informasi Tiras dan Transaksi Bahan Ajar

## Vue.js Implementation Documentation

Project ini telah di-refactor menggunakan **Vue.js 2.x** dengan konsep **Vue Component** untuk memenuhi semua requirement yang diminta.

---

## 📁 Struktur Project

```
pemesanan-bahan-ajar-SITTA-part3/
├── assets/
│   ├── css/
│   │   └── style.css
│   └── img/
│       └── ut.svg.png
├── data/
│   └── dataBahanAjar.json
├── js/
│   ├── app.js                    # ✨ Vue Root Initialization
│   ├── dashboard.js              # ✨ Dashboard Vue App
│   ├── data.js                   # Data pengguna
│   ├── dataBahanAjar.js         # Data bahan ajar (source)
│   ├── index.js                  # ✨ Login Vue App
│   ├── stok.js                   # ✨ Stok Vue App
│   ├── tracking.js               # ✨ Tracking Vue App
│   ├── components/               # ✨ Vue Components
│   │   ├── stock-table.js       # <ba-stock-table>
│   │   ├── do-tracking.js       # <do-tracking>
│   │   ├── order-form.js        # <order-form>
│   │   ├── status-badge.js      # <status-badge>
│   │   └── app-modal.js         # <app-modal>
│   └── services/
│       └── api.js                # ✨ Data Service (fetch JSON)
├── templates/
│   ├── dashboard.html            # ✨ Updated with Vue
│   ├── stok-table.html          # ✨ Updated with Vue
│   ├── do-tracking.html         # ✨ Updated with Vue
│   ├── app.modal.html           # Template reference
│   ├── status-badge.html        # Template reference
│   └── order-from.html          # Template reference
└── index.html                    # ✨ Updated with Vue

✨ = File yang di-update/dibuat dengan Vue.js
```

---

## 🎯 Requirement Implementation

### 1. ✅ Sistem Perorganisasian Kode Javascript Framework Vue.js

**Vue Component yang dibuat:**

#### a. `<ba-stock-table>` (stock-table.js)
- Menampilkan tabel stok bahan ajar
- Props: `stokData` (Array)
- Events: `@add-new`, `@edit-stock`
- Features:
  - Menampilkan data stok dalam format tabel
  - Integration dengan `<status-badge>` component
  - Currency formatting (Rp)
  - Stock color coding (merah/kuning/hijau)

#### b. `<do-tracking>` (do-tracking.js)
- Menampilkan hasil tracking DO
- Props: `trackingData`, `showResults`, `showNoResults`
- Events: `@close`
- Features:
  - Informasi penerima dan detail paket
  - Riwayat perjalanan dengan timeline
  - Date/DateTime formatting
  - Currency formatting

#### c. `<order-form>` (order-form.js)
- Form untuk membuat Delivery Order baru
- Props: `formData`, `paketList`, `stokList`
- Events: `@submit`, `@update:formData`
- Features:
  - Two-way data binding dengan v-model
  - Auto-calculate total harga
  - Validasi form (NIM, tanggal, dll)
  - Alert untuk error/warning
  - Dynamic detail paket display

#### d. `<status-badge>` (status-badge.js)
- Badge untuk menampilkan status
- Props: `item` (untuk stok), `status` (untuk tracking)
- Features:
  - Dynamic badge class berdasarkan status
  - Support untuk stok dan tracking status
  - Computed properties untuk class dan text

#### e. `<app-modal>` (app-modal.js)
- Reusable modal component berbasis Bootstrap
- Props: `modalId`, `title`, `icon`, `size`, `centered`, dll
- Events: `@confirm`, `@cancel`
- Slots: default slot dan footer slot
- Methods: `show()`, `hide()`
- Features:
  - Customizable header, footer, size
  - Support untuk custom buttons via slots

---

### 2. ✅ Menampilkan Data (Mustaches/v-text)

**Implementasi:**

```vue
<!-- Mustaches syntax -->
<span>{{ userName }}</span>
<span>{{ item.judul }}</span>
<span>{{ formatCurrency(item.harga) }}</span>

<!-- v-text directive -->
<span v-text="userName">User</span>
<span v-text="timeGreeting">Selamat Datang</span>

<!-- Filter & formatting -->
<td>{{ formatDate(tracking.tanggalKirim) }}</td>
<td>{{ formatCurrency(paket.harga) }}</td>
```

**Contoh di file:**
- `dashboard.html`: Menampilkan userName, timeGreeting, welcomeMessage
- `stok-table.html`: Menampilkan data stok (kode, judul, harga, qty, dll)
- `do-tracking.html`: Menampilkan data tracking (DO, nama, status, dll)

---

### 3. ✅ Conditional Rendering (v-if/v-else/v-show)

**Implementasi:**

```vue
<!-- v-if untuk conditional rendering -->
<div v-if="successAlert.show" class="success-overlay">...</div>
<div v-if="showResults && trackingData" class="card">...</div>
<tr v-if="filteredStok.length === 0">...</tr>

<!-- v-else untuk alternative rendering -->
<div v-if="selectedPaket">
    <!-- Detail paket -->
</div>
<div v-else>
    <p>Belum ada paket dipilih</p>
</div>

<!-- v-show untuk toggle visibility -->
<div v-show="showReportSubmenu" class="submenu-container">...</div>

<!-- Operator condition dengan v-if -->
<div v-if="formAlert.show && formAlert.type === 'warning'">...</div>
```

**Contoh di file:**
- `do-tracking.html`: v-if untuk showResults, showNoResults
- `stok-table.html`: v-if untuk empty state, v-else untuk data
- `dashboard.html`: v-show untuk submenu laporan
- `order-form.js`: v-if untuk selectedPaket, formAlert

---

### 4. ✅ Data Binding (v-bind & v-model)

**One-Way Data Binding (v-bind):**

```vue
<!-- Bind attribute -->
<span :class="getStockClass(item.qty)">{{ item.qty }}</span>
<div :class="alert.type" role="alert">...</div>
<button :disabled="isLoading">Submit</button>

<!-- Bind props ke component -->
<status-badge :item="stokItem"></status-badge>
<order-form :form-data="formData" :paket-list="paketList"></order-form>

<!-- Bind style -->
<i :style="{ transform: showReportSubmenu ? 'rotate(180deg)' : 'rotate(0deg)' }"></i>
```

**Two-Way Data Binding (v-model):**

```vue
<!-- Input text -->
<input v-model="searchQuery" placeholder="Cari...">
<input v-model.trim="formData.nim" required>

<!-- Select dropdown -->
<select v-model="filterKategori">
    <option value="">Semua Kategori</option>
    <option v-for="kategori in kategoriList" :value="kategori">...</option>
</select>

<!-- Number input dengan modifier -->
<input type="number" v-model.number="formData.qty" min="0">

<!-- Date input -->
<input type="date" v-model="formData.tanggalKirim">
```

**Computed Property:**

```vue
computed: {
    // Filter data berdasarkan search query
    filteredStok() {
        let result = this.stok;
        if (this.searchQuery) {
            result = result.filter(item => 
                item.kode.includes(this.searchQuery) ||
                item.judul.includes(this.searchQuery)
            );
        }
        return result;
    },
    
    // Generate nomor DO otomatis
    nextDONumber() {
        const year = new Date().getFullYear();
        const maxSequence = this.getMaxSequence();
        return `DO${year}-${String(maxSequence + 1).padStart(4, '0')}`;
    }
}
```

**Methods Property:**

```vue
methods: {
    saveStock() {
        if (!this.validateForm()) return;
        // Save logic
    },
    
    validateForm() {
        if (!this.formData.kode) {
            this.showAlert('warning', 'Kode harus diisi!');
            return false;
        }
        return true;
    }
}
```

---

### 5. ✅ Watcher (watch)

**Implementasi:**

```vue
watch: {
    // Watch perubahan paket yang dipilih
    'formData.paketKode'(newValue, oldValue) {
        if (newValue) {
            this.updateSelectedPaket();
        } else {
            this.selectedPaket = null;
            this.formData.total = 0;
        }
    },
    
    // Watch deep object
    formData: {
        handler(newVal) {
            this.localFormData = { ...newVal };
        },
        deep: true
    },
    
    // Watch untuk auto-update
    currentDateTime(newVal) {
        // Update display setiap detik
    }
}
```

**Contoh di file:**
- `tracking.js`: Watch `formData.paketKode` untuk update total harga
- `order-form.js`: Watch formData untuk sync dengan parent
- `dashboard.js`: Watch currentDateTime untuk real-time update

---

### 6. ✅ Array Processing dengan v-for

**Zero-Based Index:**

```vue
<!-- Array looping dengan index -->
<tr v-for="(item, index) in filteredStok" :key="item.kode">
    <td>{{ index + 1 }}</td>  <!-- Nomor urut -->
    <td>{{ item.kode }}</td>
    <td>{{ item.judul }}</td>
</tr>

<!-- Array of objects -->
<option v-for="(paket, index) in paketList" 
        :key="index" 
        :value="paket.kode">
    {{ paket.nama }}
</option>

<!-- Nested array -->
<ul>
    <li v-for="(kode, idx) in selectedPaket.isi" :key="idx">
        {{ kode }} - {{ getMatkulName(kode) }}
    </li>
</ul>
```

**Name-Based Index (Object):**

```vue
<!-- Object looping -->
<div v-for="(value, key) in trackingData" :key="key">
    <p><strong>{{ key }}:</strong> {{ value }}</p>
</div>

<!-- Object.keys() approach -->
<tr v-for="nomorDO in Object.keys(trackingData)" :key="nomorDO">
    <td>{{ nomorDO }}</td>
    <td>{{ trackingData[nomorDO].nama }}</td>
</tr>

<!-- Computed property untuk convert object to array -->
computed: {
    trackingList() {
        return Object.keys(this.trackingData).map(nomorDO => ({
            nomorDO,
            ...this.trackingData[nomorDO]
        }));
    }
}
```

**Contoh di file:**
- `stok-table.html`: Loop filteredStok array
- `do-tracking.html`: Loop trackingList dan perjalanan array
- `dashboard.html`: Loop menu items
- `order-form.js`: Loop paketList dan selectedPaket.isi

---

### 7. ✅ Formatting Data dengan Filter

**Custom Filter Methods:**

```javascript
// Format currency
formatCurrency(value) {
    return 'Rp ' + value.toLocaleString('id-ID');
}

// Format date
formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Format datetime
formatDateTime(dateTimeString) {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format text
getStatusText(item) {
    if (item.qty === 0) return 'Habis';
    else if (item.qty < item.safety) return 'Stok Rendah';
    else return 'Tersedia';
}
```

**Penggunaan:**

```vue
<!-- Currency formatting -->
<td>{{ formatCurrency(item.harga) }}</td>
<span>{{ formatCurrency(tracking.total) }}</span>

<!-- Date formatting -->
<td>{{ formatDate(tracking.tanggalKirim) }}</td>

<!-- DateTime formatting -->
<div>{{ formatDateTime(perjalanan.waktu) }}</div>

<!-- Custom text formatting -->
<span>{{ getStatusText(item) }}</span>
```

---

### 8. ✅ Custom Element, Vue Component, dan Property Template

**Custom Element Registration:**

```javascript
// Registrasi global component
Vue.component('ba-stock-table', { /* ... */ });
Vue.component('status-badge', { /* ... */ });
Vue.component('do-tracking', { /* ... */ });
Vue.component('order-form', { /* ... */ });
Vue.component('app-modal', { /* ... */ });
```

**Component dengan Props:**

```javascript
// Component definition dengan props
Vue.component('status-badge', {
    props: {
        item: {
            type: Object,
            required: false
        },
        status: {
            type: String,
            required: false
        }
    },
    // ...
});
```

**Template Property:**

```javascript
// Inline template string
Vue.component('ba-stock-table', {
    template: `
        <div class="stock-table-component">
            <!-- Template content -->
        </div>
    `,
    props: { /* ... */ },
    methods: { /* ... */ }
});
```

**Component Communication:**

```vue
<!-- Parent ke Child (Props) -->
<order-form 
    :form-data="formData"
    :paket-list="paketList"
    :stok-list="stokList">
</order-form>

<!-- Child ke Parent (Events) -->
<order-form @submit="handleSubmit"></order-form>

<!-- Two-way binding -->
<order-form 
    :form-data="formData"
    @update:formData="formData = $event">
</order-form>

<!-- Component slots -->
<app-modal>
    <p>Content goes here</p>
    <template v-slot:footer>
        <button>Custom Footer</button>
    </template>
</app-modal>
```

---

## 🗂️ Data Service (api.js)

**Fitur DataService:**

```javascript
// Initialize service
DataService.init();

// Get data
const upbjjList = DataService.getUpbjjList();
const stokList = DataService.getStokList();
const paketList = DataService.getPaketList();
const trackingData = DataService.getTrackingData();

// Save/Update data
DataService.saveStok(stokData);
DataService.saveTracking(nomorDO, trackingInfo);

// Filter & sort
const filtered = DataService.filterStok({
    search: 'EKMA',
    kategori: 'MK Wajib',
    upbjj: 'Jakarta'
});
const sorted = DataService.sortStok(stokList, 'harga-asc');

// Get single item
const paket = DataService.getPaketByKode('PAKET-UT-001');
const stok = DataService.getStokByKode('EKMA4116');
const tracking = DataService.getTrackingByDO('DO2025-0001');
```

---

## 🚀 Cara Menjalankan Project

### 1. Setup XAMPP
```bash
# Copy project ke htdocs
C:\xampp\htdocs\pemesanan-bahan-ajar-SITTA-part3\
```

### 2. Start Apache Server
- Buka XAMPP Control Panel
- Start Apache

### 3. Akses Aplikasi
```
http://localhost/pemesanan-bahan-ajar-SITTA-part3/
```

### 4. Login
**Default User:**
- Email: `rina@ut.ac.id`
- Password: `rina123`

atau

- Email: `admin@ut.ac.id`
- Password: `admin123`

---

## 📱 Fitur Aplikasi

### 1. Login Page (`index.html`)
- ✅ Vue.js integration
- ✅ Login validation
- ✅ Registration modal
- ✅ Forgot password modal
- ✅ Inline alerts
- ✅ Center alerts untuk feedback

### 2. Dashboard (`templates/dashboard.html`)
- ✅ Real-time greeting berdasarkan waktu
- ✅ Dynamic date/time display
- ✅ User info display
- ✅ Menu navigation dengan Vue
- ✅ Submenu toggle dengan v-show
- ✅ Computed properties untuk greeting icon

### 3. Stok Bahan Ajar (`templates/stok-table.html`)
- ✅ Tabel dengan `<ba-stock-table>` component
- ✅ Filter: search, kategori, UPBJJ
- ✅ Sort: judul, qty, harga (ascending/descending)
- ✅ `<status-badge>` untuk status stok
- ✅ Modal untuk tambah/edit stok
- ✅ Form validation
- ✅ Success/error alerts
- ✅ Two-way data binding pada form
- ✅ Computed property untuk filteredStok
- ✅ Watch untuk stock warning

### 4. Tracking Pengiriman (`templates/do-tracking.html`)
- ✅ Form pencarian DO
- ✅ `<do-tracking>` component untuk hasil
- ✅ `<order-form>` component untuk tambah DO
- ✅ Tabel daftar semua DO
- ✅ Auto-generate nomor DO
- ✅ Detail paket dengan v-for
- ✅ Riwayat perjalanan
- ✅ Date/datetime formatting
- ✅ Watch untuk paket selection
- ✅ Computed property untuk nextDONumber

---

## 🎨 Vue Directives yang Digunakan

| Directive | Kegunaan | Contoh File |
|-----------|----------|-------------|
| `v-model` | Two-way data binding | stok-table.html, do-tracking.html |
| `v-bind` / `:` | One-way data binding | Semua file Vue |
| `v-if` | Conditional rendering | stok-table.html, do-tracking.html |
| `v-else` | Alternative rendering | order-form.js |
| `v-show` | Toggle visibility | dashboard.html |
| `v-for` | Loop array/object | Semua file tabel |
| `v-on` / `@` | Event handling | Semua file Vue |
| `v-text` | Text content | dashboard.html |
| `v-html` | HTML content | stok-table.html (catatan) |

---

## 📊 Computed Properties yang Digunakan

1. **filteredStok** (stok.js): Filter & sort stok
2. **nextDONumber** (tracking.js): Generate nomor DO
3. **trackingList** (tracking.js): Convert object to array
4. **selectedPaket** (order-form.js): Get paket yang dipilih
5. **statusText** (status-badge.js): Text status berdasarkan kondisi
6. **badgeClass** (status-badge.js): CSS class berdasarkan status
7. **greetingIcon** (dashboard.js): Icon greeting berdasarkan waktu

---

## 👁️ Watchers yang Digunakan

1. **formData.paketKode** (tracking.js): Update total harga
2. **formData** (order-form.js): Sync data dengan parent
3. **currentDateTime** (dashboard.js): Real-time update

---

## 🔧 Methods yang Penting

### Formatting Methods:
- `formatCurrency(value)`: Format ke Rupiah
- `formatDate(dateString)`: Format tanggal
- `formatDateTime(dateTimeString)`: Format tanggal & waktu

### Validation Methods:
- `validateForm()`: Validasi form input
- `validate()`: Validasi component

### CRUD Methods:
- `saveStock()`: Simpan/update stok
- `saveDO()`: Simpan delivery order
- `editStock(index)`: Edit stok
- `deleteStock(kode)`: Hapus stok (via API service)

### UI Methods:
- `showAlert()`: Tampilkan alert
- `hideAlert()`: Sembunyikan alert
- `openModal()`: Buka modal
- `closeModal()`: Tutup modal

---

## 📝 Data Source

**dataBahanAjar.js** berisi:
- `upbjjList`: Daftar UPBJJ
- `kategoriList`: Daftar kategori MK
- `pengirimanList`: Jenis pengiriman
- `paket`: Paket bahan ajar
- `stok`: Data stok bahan ajar
- `tracking`: Data tracking DO

**data.js** berisi:
- `dataPengguna`: Data user untuk login

---

## 🎯 Best Practices yang Diterapkan

1. ✅ **Component-Based Architecture**: Semua komponen terpisah dan reusable
2. ✅ **Props Validation**: Semua props memiliki type dan required
3. ✅ **Event Handling**: Communication antara parent-child via events
4. ✅ **Computed Properties**: Untuk data yang dihitung/derived
5. ✅ **Watchers**: Untuk reactive side effects
6. ✅ **Methods Organization**: Methods dikelompokkan berdasarkan fungsi
7. ✅ **Two-Way Binding**: v-model untuk form inputs
8. ✅ **Conditional Rendering**: v-if/v-else/v-show untuk UI states
9. ✅ **List Rendering**: v-for dengan :key untuk performance
10. ✅ **Lifecycle Hooks**: mounted, beforeDestroy untuk setup/cleanup

---

## 🔒 Security Notes

⚠️ **Catatan Penting:**
- Password disimpan plain text (untuk development)
- Tidak ada enkripsi (untuk development)
- Data disimpan di sessionStorage (akan hilang saat browser ditutup)
- Untuk production, implement proper authentication & authorization

---

## 🐛 Troubleshooting

### Vue is not defined
**Solution:** Pastikan Vue.js CDN di-load sebelum script lain:
```html
<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
```

### Component not registered
**Solution:** Pastikan component file di-load sebelum digunakan:
```html
<script src="../js/components/status-badge.js"></script>
<script src="../js/components/stock-table.js"></script>
```

### Asset path not found
**Solution:** Pastikan menggunakan relative path yang benar:
```html
<!-- Di index.html -->
<link rel="stylesheet" href="assets/css/style.css">

<!-- Di templates/*.html -->
<link rel="stylesheet" href="../assets/css/style.css">
```

---

## 📚 Resources

- [Vue.js 2.x Documentation](https://v2.vuejs.org/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)

---

## 👨‍💻 Developer Notes

**Teknologi yang digunakan:**
- Vue.js 2.x (CDN)
- Bootstrap 5.3
- Bootstrap Icons
- Vanilla JavaScript (untuk utility functions)

**Browser Support:**
- Chrome (recommended)
- Firefox
- Edge
- Safari

---

## ✅ Checklist Requirement

- [x] 1. Sistem perorganisasian kode Vue.js dengan Vue Component
- [x] 2. Menampilkan data (mustaches/v-text)
- [x] 3. Conditional rendering (v-if/v-else/v-show)
- [x] 4. Data binding (v-bind/v-model) dan computed/methods property
- [x] 5. Watcher untuk reactive side effects
- [x] 6. Array processing dengan v-for (zero-based & name-based index)
- [x] 7. Formatting data dengan custom methods
- [x] 8. Custom element, Vue Component, dan Property Template

---

**Last Updated:** November 24, 2025
**Version:** 3.0.0 (Vue.js Implementation)
