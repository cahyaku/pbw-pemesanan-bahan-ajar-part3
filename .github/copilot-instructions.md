# SITTA - Copilot Instructions

## Project Overview
SITTA (Sistem Informasi Tiras dan Transaksi Bahan Ajar) is a Vue.js 2.x educational materials management system for Universitas Terbuka, running on XAMPP with Apache. This is a **client-side only application** with no backend server - all data is stored in `sessionStorage` and JavaScript files.

## Architecture

### Core Technology Stack
- **Framework**: Vue.js 2.x (CDN-based, no build tools)
- **UI**: Bootstrap 5.3 with Bootstrap Icons
- **Server**: XAMPP Apache (PHP not used, just static file serving)
- **Data Storage**: `sessionStorage` + in-memory JavaScript objects
- **Authentication**: Client-side only, credentials in `js/datajs/data.js`

### Application Structure
```
index.html                          # Login page (root level)
templates/
  ├── dashboard.html                # Main dashboard
  ├── stok-table.html              # Inventory management  
  └── do-tracking.html             # Delivery order tracking
js/
  ├── app.js                        # Root Vue instance (rarely used)
  ├── components/
  │   ├── dashboard-app.js         # Standalone Vue app for dashboard
  │   ├── stock-table.js           # <stock-table> component
  │   ├── do-tracking.js           # DO tracking Vue app
  │   ├── order-form.js            # <order-form> component
  │   ├── status-badge.js          # <status-badge> component
  │   └── app-modal.js             # <app-modal> reusable modal
  ├── datajs/
  │   ├── data.js                  # User credentials
  │   └── dataBahanAjar.js         # Source of truth for all app data
  └── services/
      └── api.js                    # DataService wrapper (no HTTP calls)
```

### Critical Architecture Decisions

**1. Standalone Vue Apps, Not Single SPA**
Each HTML page initializes its own Vue instance independently. There is NO shared Vue root across pages. Files like `dashboard-app.js`, `do-tracking.js`, and `index.js` each create `new Vue({ el: '#app' })`.

**2. Data Source Pattern**
- `dataBahanAjarSource` in `dataBahanAjar.js` is the **single source of truth**
- `DataService` in `api.js` provides accessor methods but does NOT make HTTP requests
- Components directly mutate `dataBahanAjarSource` when saving (see `stock-table.js` lines 670-680)
- No persistence - data resets on page reload by design

**3. Component Registration**
Global components (`Vue.component()`) are registered BEFORE the page's Vue instance:
```html
<!-- Correct order in HTML -->
<script src="vue.js"></script>
<script src="components/app-modal.js"></script>
<script src="components/stock-table.js"></script>
<script src="dashboard-app.js"></script> <!-- Creates Vue instance -->
```

**4. Authentication Flow**
```javascript
// Login saves to sessionStorage
sessionStorage.setItem('currentUser', JSON.stringify(user));

// Protected pages check on load
function isLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null;
}
```

## Development Patterns

### Adding New Components
1. Register component globally in separate file: `Vue.component('my-comp', { ... })`
2. Include script BEFORE the page's Vue app script in HTML
3. Use kebab-case in templates: `<my-comp :prop="data"></my-comp>`

### Data Flow
```
User Action → Component Method → Mutate dataBahanAjarSource → Reactive Update
```
Example from `stock-table.js`:
```javascript
saveStock() {
    // Update local array
    this.$set(this.stok, this.editIndex, { ...this.formData });
    
    // Update source of truth
    const sourceIndex = dataBahanAjarSource.stok.findIndex(s => s.kode === this.formData.kode);
    dataBahanAjarSource.stok[sourceIndex] = { ...this.formData };
}
```

### Modal Pattern
Use the reusable `<app-modal>` component (Bootstrap-based):
```vue
<app-modal ref="myModal" modal-id="myModal" title="My Title"
    @confirm="handleSave" @cancel="handleCancel">
    <!-- Content -->
</app-modal>

// In methods:
this.$refs.myModal.show();
this.$refs.myModal.hide();
```

### Filtering & Computed Properties
All list filtering uses computed properties (see `stock-table.js` lines 570-610):
```javascript
computed: {
    filteredStok() {
        let result = this.stok;
        if (this.searchQuery) {
            result = result.filter(/* ... */);
        }
        return result;
    }
}
```

### Formatting Pattern
Currency and dates use methods, NOT Vue filters (V2 filters avoided):
```javascript
methods: {
    formatCurrency(value) {
        return 'Rp ' + value.toLocaleString('id-ID');
    },
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    }
}
// Usage: {{ formatCurrency(item.harga) }}
```

## File Conventions

### Component Files
- Name: `kebab-case.js` (e.g., `stock-table.js`, `order-form.js`)
- Export: Global registration via `Vue.component('component-name', { ... })`
- Template: Inline template strings with backticks
- Props: Always validate with `type` and `required`

### Vue App Files  
- Name: `feature-app.js` (e.g., `dashboard-app.js`)
- Pattern: Standalone Vue instance that checks `isLoggedIn()` before init
- Lifecycle: Use `mounted()` for data loading, `beforeDestroy()` for cleanup (e.g., `clearInterval`)

### Data Files
- `dataBahanAjar.js`: Global variable `dataBahanAjarSource` (not Vue data)
- `data.js`: Global variable `dataPengguna` (plain array)
- Never wrap in IIFE or modules - must be globally accessible

### Style Conventions
- CSS Variables in `style.css`: `var(--primary-color)`, `var(--shadow-light)`
- Body classes: `.login-page`, `.dashboard-page`, `.tracking-page`
- Alert classes: `.alert-success`, `.alert-danger`, `.alert-warning`
- Custom classes: `.success-overlay`, `.menu-card`, `.welcome-card`

## Common Tasks

### Running the App
1. Start XAMPP Control Panel
2. Click **Start** on Apache (must be green)
3. Navigate to `http://localhost/pemesanan-bahan-ajar-SITTA-part3/`
4. Login: `rina@ut.ac.id` / `rina123` or `admin@ut.ac.id` / `admin123`

### Debugging
- Open browser DevTools (F12) → Console tab
- Check for "Component not registered" errors (script load order issue)
- Check sessionStorage: `sessionStorage.getItem('currentUser')`
- Vue DevTools extension works (Vue 2.x detected)

### Adding CRUD Features
Reference `stock-table.js` as the canonical example (lines 450-730):
1. Computed property for filtering
2. Modal with `<app-modal>` 
3. Form validation in `validateForm()`
4. Save mutates both local array AND `dataBahanAjarSource`
5. Success alert using `showSuccessAlert()` overlay pattern

### Asset Paths
- Root `index.html`: `assets/css/style.css`
- Templates folder: `../assets/css/style.css` (up one level)
- Always use relative paths, never absolute

## Project-Specific Quirks

1. **No Build Step**: Directly edit `.js` files and refresh browser. No webpack/vite.

2. **Data Persistence**: `sessionStorage` data persists until browser/tab closes. For permanent changes, edit `dataBahanAjar.js` directly.

3. **Dual Data Sources**: Some files load from `data/dataBahanAjar.json` OR `datajs/dataBahanAjar.js`. The JS file is the actual source; JSON is unused fallback.

4. **Component Loading Race**: If `dataBahanAjarSource` is undefined, components retry after 500ms (see `stock-table.js` line 755).

5. **Status Badge Logic**: Stock status determined by qty vs safety threshold:
   - `qty === 0`: "Habis" (red)
   - `qty < safety`: "Stok Rendah" (yellow)  
   - `qty >= safety`: "Tersedia" (green)

6. **DO Number Format**: `DO{year}-{sequence}` (e.g., `DO2025-0001`). Sequence auto-increments from existing tracking data.

7. **HTML in Data**: `catatanHTML` field allows raw HTML (`<em>`, `<strong>`) rendered via `v-html`.

## Testing Checklist
- [ ] Login with valid/invalid credentials
- [ ] Dashboard time greeting updates every second
- [ ] Stock table filter by search/category/UPBJJ
- [ ] Stock table sort by judul/qty/harga (asc/desc)
- [ ] Add new stock item with validation
- [ ] Edit existing stock (kode field disabled)
- [ ] Delete stock with confirmation modal
- [ ] Track existing DO (e.g., `DO2025-0001`)
- [ ] Create new DO with auto-generated number
- [ ] Status badges show correct colors/text

## Documentation
- Full Vue.js patterns: `README-VUEJS.md`
- Quick start guide: `QUICKSTART.md`
- Vue 2.x API: https://v2.vuejs.org/
