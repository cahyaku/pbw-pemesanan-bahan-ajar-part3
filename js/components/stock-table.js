/**
 * stock-table.js - Vue Component untuk Stok Bahan Ajar Management
 * Complete CRUD component dengan filter, sort, dan modal management
 * Custom element: <stock-table>
 */

Vue.component('stock-table', {
    template: `
        <div class="stock-table-app">
            <!-- Success Alert Overlay -->
            <div v-if="successAlert.show" class="success-overlay">
                <div class="success-modal">
                    <div class="text-center">
                        <div class="success-icon mb-3">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                        <h3 class="text-success mb-2">{{ successAlert.title }}</h3>
                        <p class="mb-3">{{ successAlert.message }}</p>
                        <button type="button" class="btn btn-success" @click="hideSuccessAlert">
                            <i class="bi bi-check me-2"></i>OK
                        </button>
                    </div>
                </div>
            </div>

            <!-- Alert Container -->
            <div class="alert-container">
                <transition name="fade">
                    <div v-if="alert.show" class="alert" :class="alert.type" role="alert">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <i :class="alert.icon" class="me-2"></i>
                                <strong>{{ alert.title }}</strong>
                                <div class="mt-1">{{ alert.message }}</div>
                            </div>
                            <button type="button" class="btn-close" @click="hideAlert"></button>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Filter Section -->
            <div class="row mb-3">
                <div class="col-md-3 mb-2">
                    <input type="text" class="form-control" v-model="searchQuery"
                        placeholder="Cari kode atau nama mata kuliah...">
                </div>
                <div class="col-md-2 mb-2">
                    <select class="form-select" v-model="filterKategori">
                        <option value="">Semua Kategori</option>
                        <option v-for="kategori in kategoriList" :key="kategori" :value="kategori">
                            {{ kategori }}
                        </option>
                    </select>
                </div>
                <div class="col-md-2 mb-2">
                    <select class="form-select" v-model="filterUpbjj">
                        <option value="">Semua UT Daerah</option>
                        <option v-for="upbjj in upbjjList" :key="upbjj" :value="upbjj">{{ upbjj }}</option>
                    </select>
                </div>
                <div class="col-md-3 mb-2">
                    <select class="form-select" v-model="sortBy">
                        <option value="">Urutkan Berdasarkan</option>
                        <option value="judul-asc">Judul (A-Z)</option>
                        <option value="judul-desc">Judul (Z-A)</option>
                        <option value="qty-asc">Stok (Terendah)</option>
                        <option value="qty-desc">Stok (Tertinggi)</option>
                        <option value="harga-asc">Harga (Termurah)</option>
                        <option value="harga-desc">Harga (Termahal)</option>
                    </select>
                </div>
                <div class="col-md-2 mb-2">
                    <button class="btn btn-secondary w-100" @click="resetFilters">
                        <i class="bi bi-arrow-clockwise me-1"></i>Reset
                    </button>
                </div>
            </div>

            <!-- Tabel Stok -->
            <div class="card">
                <div class="card-header bg-gradient text-white">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-table me-2"></i>Daftar Stok Bahan Ajar
                            <span class="badge bg-light text-dark ms-2">{{ filteredStok.length }} item</span>
                        </h5>
                        <button class="btn fw-bold"
                            style="background-color: #FFF9C4; border-color: #FFF9C4; color: #333;"
                            @click="showAddStockModal">
                            <i class="bi bi-plus-circle me-2"></i>Tambah Stok Baru
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead style="background-color: #e5e5e5;">
                                <tr>
                                    <th>No</th>
                                    <th>Kode MK</th>
                                    <th>Nama Mata Kuliah</th>
                                    <th>Harga</th>
                                    <th>Kategori</th>
                                    <th>UT-Daerah</th>
                                    <th>Lokasi Rak</th>
                                    <th class="text-center">Stok</th>
                                    <th class="text-center">Safety Stock</th>
                                    <th>Status</th>
                                    <th>Catatan</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="filteredStok.length === 0">
                                    <td colspan="12" class="text-center text-muted py-4">
                                        <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                                        Tidak ada data stok bahan ajar yang ditemukan
                                    </td>
                                </tr>
                                <tr v-else v-for="(item, index) in filteredStok" :key="item.kode">
                                    <td>{{ index + 1 }}</td>
                                    <td><span class="badge bg-secondary">{{ item.kode }}</span></td>
                                    <td>{{ item.judul }}</td>
                                    <td>Rp {{ item.harga.toLocaleString('id-ID') }}</td>
                                    <td><span class="badge bg-info">{{ item.kategori }}</span></td>
                                    <td>{{ item.upbjj }}</td>
                                    <td><span class="badge bg-dark">{{ item.lokasiRak }}</span></td>
                                    <td class="text-center">
                                        <span class="fw-bold" :class="getStockClass(item.qty)">
                                            {{ item.qty }}
                                        </span>
                                    </td>
                                    <td class="text-center">{{ item.safety }}</td>
                                    <td class="text-center">
                                        <status-badge :item="item"></status-badge>
                                    </td>
                                    <td><small v-html="item.catatanHTML"></small></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary me-1"
                                            @click="editStock(index)" title="Edit">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger"
                                            @click="deleteStock(index)" title="Hapus">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Modal Tambah/Edit menggunakan app-modal -->
            <app-modal ref="stockModal" modal-id="stockModal"
                :title="editMode ? 'Edit Stok Bahan Ajar' : 'Tambah Stok Bahan Ajar Baru'"
                :icon="editMode ? 'bi bi-pencil' : 'bi bi-plus-circle'"
                size="lg" :centered="true" header-variant="primary"
                :confirm-text="editMode ? 'Update Stok' : 'Tambah Stok'"
                cancel-text="Batal"
                @confirm="saveStock"
                @cancel="handleModalCancel">
                
                <!-- Alert di dalam form -->
                <div v-if="formAlert.show" class="alert" :class="formAlert.type" role="alert">
                    <div class="d-flex align-items-center">
                        <i :class="formAlert.icon" class="me-2"></i>
                        <div>
                            <strong>{{ formAlert.title }}</strong>
                            <div class="mt-1">{{ formAlert.message }}</div>
                        </div>
                        <button type="button" class="btn-close ms-auto" @click="hideFormAlert"></button>
                    </div>
                </div>

                <!-- Form Content -->
                <form @submit.prevent="saveStock">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Kode Mata Kuliah</label>
                            <input type="text" class="form-control" v-model.trim="formData.kode"
                                :disabled="editMode" placeholder="Contoh: EKMA4116" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Nama Mata Kuliah</label>
                            <input type="text" class="form-control" v-model.trim="formData.judul"
                                placeholder="Contoh: Pengantar Manajemen" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Kategori</label>
                            <select class="form-select" v-model="formData.kategori" required>
                                <option value="">Pilih Kategori</option>
                                <option v-for="kategori in kategoriList" :key="kategori" :value="kategori">
                                    {{ kategori }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">UT-Daerah</label>
                            <select class="form-select" v-model="formData.upbjj" required>
                                <option value="">Pilih UT Daerah</option>
                                <option v-for="upbjj in upbjjList" :key="upbjj" :value="upbjj">
                                    {{ upbjj }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Lokasi Rak</label>
                            <input type="text" class="form-control" v-model.trim="formData.lokasiRak"
                                placeholder="Contoh: R1-A3" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Jumlah Stok</label>
                            <input type="number" class="form-control" v-model.number="formData.qty"
                                placeholder="0" min="0" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Safety Stock</label>
                            <input type="number" class="form-control" v-model.number="formData.safety"
                                placeholder="0" min="0" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 mb-3">
                            <label class="form-label">Harga</label>
                            <input type="number" class="form-control" v-model.number="formData.harga"
                                placeholder="0" min="0" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Catatan</label>
                        <textarea class="form-control" v-model="formData.catatanHTML" rows="2"
                            placeholder="Catatan tambahan (opsional)"></textarea>
                        <small class="text-muted">Anda dapat menggunakan HTML tags</small>
                    </div>
                    <div v-if="stockWarning" class="alert alert-warning" role="alert">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        {{ stockWarning }}
                    </div>
                </form>
            </app-modal>

            <!-- Modal Konfirmasi Hapus -->
            <app-modal ref="deleteModal" modal-id="deleteModal"
                title="Konfirmasi Hapus Data" icon="bi bi-trash"
                size="md" :centered="true" header-variant="danger"
                confirm-text="Hapus" cancel-text="Batal" confirm-variant="danger"
                @confirm="confirmDelete" @cancel="cancelDelete">
                
                <div class="text-center py-3">
                    <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 4rem;"></i>
                    <h5 class="mt-3">Apakah Anda yakin ingin menghapus data ini?</h5>
                    <p class="text-muted mb-0" v-if="deleteItem">
                        <strong>{{ deleteItem.kode }}</strong> - {{ deleteItem.judul }}
                    </p>
                    <p class="text-danger mt-2 mb-0">
                        <small><i class="bi bi-info-circle me-1"></i>Data yang dihapus tidak dapat dikembalikan!</small>
                    </p>
                </div>
            </app-modal>
        </div>
    `,
    data() {
        return {
            // Data dari dataBahanAjar.json
            upbjjList: [],
            kategoriList: [],
            stok: [],

            // Filter
            searchQuery: '',
            filterKategori: '',
            filterUpbjj: '',
            sortBy: '',

            // Form data
            formData: {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            },

            // Modal state
            editMode: false,
            editIndex: -1,

            // Delete state
            deleteItem: null,
            deleteIndex: -1,

            // Alerts
            alert: {
                show: false,
                type: '',
                title: '',
                message: '',
                icon: '',
                timeout: null
            },
            formAlert: {
                show: false,
                type: '',
                title: '',
                message: '',
                icon: ''
            },
            successAlert: {
                show: false,
                title: '',
                message: ''
            }
        };
    },
    computed: {
        /**
         * Filter dan sort stok
         */
        filteredStok() {
            let result = this.stok;

            // Filter by search query
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(item =>
                    item.kode.toLowerCase().includes(query) ||
                    item.judul.toLowerCase().includes(query)
                );
            }

            // Filter by kategori
            if (this.filterKategori) {
                result = result.filter(item => item.kategori === this.filterKategori);
            }

            // Filter by UPBJJ
            if (this.filterUpbjj) {
                result = result.filter(item => item.upbjj === this.filterUpbjj);
            }

            // Sort
            if (this.sortBy) {
                const [field, order] = this.sortBy.split('-');
                result = [...result].sort((a, b) => {
                    let valueA, valueB;

                    if (field === 'judul') {
                        valueA = a.judul.toLowerCase();
                        valueB = b.judul.toLowerCase();
                        return order === 'asc'
                            ? valueA.localeCompare(valueB)
                            : valueB.localeCompare(valueA);
                    } else if (field === 'qty' || field === 'harga') {
                        valueA = a[field];
                        valueB = b[field];
                        return order === 'asc' ? valueA - valueB : valueB - valueA;
                    }

                    return 0;
                });
            }

            return result;
        },

        /**
         * Stock warning
         */
        stockWarning() {
            if (this.formData.qty > 0 && this.formData.safety > 0) {
                if (this.formData.qty < this.formData.safety) {
                    return `Peringatan: Stok (${this.formData.qty}) di bawah safety stock (${this.formData.safety})!`;
                }
            }
            return '';
        }
    },
    methods: {
        /**
         * Load data dari dataBahanAjarSource
         */
        loadDataFromSource() {
            if (typeof dataBahanAjarSource !== 'undefined' && dataBahanAjarSource) {
                this.upbjjList = dataBahanAjarSource.upbjjList || [];
                this.kategoriList = dataBahanAjarSource.kategoriList || [];
                this.stok = dataBahanAjarSource.stok || [];
            } else {
                console.warn('dataBahanAjarSource not ready, will retry...');
                // Retry after 500ms
                setTimeout(() => this.loadDataFromSource(), 500);
            }
        },

        /**
         * Get stock class
         */
        getStockClass(qty) {
            if (qty === 0) return 'text-danger';
            else if (qty <= 10) return 'text-warning';
            else return 'text-success';
        },

        /**
         * Reset filters
         */
        resetFilters() {
            this.searchQuery = '';
            this.filterKategori = '';
            this.filterUpbjj = '';
            this.sortBy = '';
        },

        /**
         * Show add modal
         */
        showAddStockModal() {
            this.editMode = false;
            this.editIndex = -1;
            this.resetFormData();
            this.hideFormAlert();
            this.$nextTick(() => {
                if (this.$refs.stockModal) {
                    this.$refs.stockModal.show();
                }
            });
        },

        /**
         * Edit stock
         */
        editStock(index) {
            this.editMode = true;
            const item = this.filteredStok[index];
            this.editIndex = this.stok.findIndex(s => s.kode === item.kode);
            this.formData = { ...item };
            this.hideFormAlert();
            this.$nextTick(() => {
                if (this.$refs.stockModal) {
                    this.$refs.stockModal.show();
                }
            });
        },

        /**
         * Delete stock
         */
        deleteStock(index) {
            const item = this.filteredStok[index];
            this.deleteIndex = this.stok.findIndex(s => s.kode === item.kode);
            this.deleteItem = { ...item };
            this.$nextTick(() => {
                if (this.$refs.deleteModal) {
                    this.$refs.deleteModal.show();
                }
            });
        },

        /**
         * Confirm delete
         */
        confirmDelete() {
            try {
                if (this.deleteIndex >= 0 && this.deleteItem) {
                    const deletedItem = this.stok[this.deleteIndex];
                    this.stok.splice(this.deleteIndex, 1);

                    // Update source
                    if (typeof dataBahanAjarSource !== 'undefined' && Array.isArray(dataBahanAjarSource.stok)) {
                        const sourceIndex = dataBahanAjarSource.stok.findIndex(s => s.kode === deletedItem.kode);
                        if (sourceIndex >= 0) {
                            dataBahanAjarSource.stok.splice(sourceIndex, 1);
                        }
                    }

                    if (this.$refs.deleteModal) {
                        this.$refs.deleteModal.hide();
                    }

                    this.showSuccessAlert('Berhasil Dihapus!', `Data ${deletedItem.kode} - ${deletedItem.judul} berhasil dihapus.`);

                    this.deleteItem = null;
                    this.deleteIndex = -1;
                }
            } catch (error) {
                console.error('Error deleting stock:', error);
                this.showAlert('danger', 'Gagal Menghapus!', 'Terjadi kesalahan saat menghapus data.');
            }
        },

        /**
         * Cancel delete
         */
        cancelDelete() {
            this.deleteItem = null;
            this.deleteIndex = -1;
        },

        /**
         * Save stock
         */
        saveStock() {
            try {
                if (!this.validateForm()) {
                    return;
                }

                if (this.editMode) {
                    // Update
                    this.$set(this.stok, this.editIndex, { ...this.formData });

                    if (typeof dataBahanAjarSource !== 'undefined' && Array.isArray(dataBahanAjarSource.stok)) {
                        const sourceIndex = dataBahanAjarSource.stok.findIndex(s => s.kode === this.formData.kode);
                        if (sourceIndex >= 0) {
                            dataBahanAjarSource.stok[sourceIndex] = { ...this.formData };
                        }
                    }

                    if (this.$refs.stockModal) {
                        this.$refs.stockModal.hide();
                    }

                    this.showSuccessAlert('Berhasil!', `Stok ${this.formData.kode} berhasil diupdate.`);
                } else {
                    // Create
                    const exists = this.stok.some(item => item.kode === this.formData.kode);
                    if (exists) {
                        this.showFormAlert('warning', 'Kode Sudah Ada!', 'Kode mata kuliah sudah ada dalam sistem!');
                        return;
                    }

                    this.stok.push({ ...this.formData });

                    if (typeof dataBahanAjarSource !== 'undefined' && Array.isArray(dataBahanAjarSource.stok)) {
                        dataBahanAjarSource.stok.push({ ...this.formData });
                    }

                    if (this.$refs.stockModal) {
                        this.$refs.stockModal.hide();
                    }

                    this.showSuccessAlert('Berhasil!', `Stok ${this.formData.kode} berhasil ditambahkan.`);
                }
            } catch (error) {
                console.error('Error saving stock:', error);
                this.showFormAlert('danger', 'Gagal Menyimpan!', 'Terjadi kesalahan saat menyimpan data.');
            }
        },

        /**
         * Validate form
         */
        validateForm() {
            this.hideFormAlert();

            if (!this.formData.kode || !this.formData.judul) {
                this.showFormAlert('warning', 'Data Tidak Lengkap!', 'Kode dan Nama Mata Kuliah harus diisi!');
                return false;
            }

            if (!this.formData.kategori || !this.formData.upbjj) {
                this.showFormAlert('warning', 'Data Tidak Lengkap!', 'Kategori dan UT-Daerah harus dipilih!');
                return false;
            }

            if (!this.formData.lokasiRak) {
                this.showFormAlert('warning', 'Data Tidak Lengkap!', 'Lokasi Rak harus diisi!');
                return false;
            }

            if (this.formData.qty < 0 || this.formData.safety < 0) {
                this.showFormAlert('warning', 'Nilai Tidak Valid!', 'Jumlah stok dan safety stock tidak boleh negatif!');
                return false;
            }

            if (this.formData.harga <= 0) {
                this.showFormAlert('warning', 'Harga Tidak Valid!', 'Harga harus lebih dari 0!');
                return false;
            }

            if (!/^[A-Z]{4}\d{4}$/.test(this.formData.kode)) {
                this.showFormAlert('warning', 'Format Salah!', 'Format kode: 4 huruf + 4 angka (contoh: EKMA4116)!');
                return false;
            }

            return true;
        },

        /**
         * Reset form
         */
        resetFormData() {
            this.formData = {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            };
        },

        /**
         * Handle modal cancel
         */
        handleModalCancel() {
            this.hideFormAlert();
            this.resetFormData();
        },

        /**
         * Alert methods
         */
        showAlert(type, title, message, duration = 5000) {
            const iconMap = {
                success: 'bi bi-check-circle-fill',
                danger: 'bi bi-exclamation-triangle-fill',
                warning: 'bi bi-exclamation-triangle-fill',
                info: 'bi bi-info-circle-fill'
            };

            if (this.alert.timeout) clearTimeout(this.alert.timeout);

            this.alert = {
                show: true,
                type: `alert-${type}`,
                title,
                message,
                icon: iconMap[type] || iconMap.info,
                timeout: setTimeout(() => this.hideAlert(), duration)
            };
        },

        hideAlert() {
            this.alert.show = false;
            if (this.alert.timeout) {
                clearTimeout(this.alert.timeout);
                this.alert.timeout = null;
            }
        },

        showFormAlert(type, title, message) {
            const iconMap = {
                danger: 'bi bi-exclamation-triangle-fill',
                warning: 'bi bi-exclamation-triangle-fill'
            };

            this.formAlert = {
                show: true,
                type: `alert-${type}`,
                title,
                message,
                icon: iconMap[type] || 'bi bi-info-circle-fill'
            };
        },

        hideFormAlert() {
            this.formAlert.show = false;
        },

        showSuccessAlert(title, message) {
            this.successAlert = { show: true, title, message };
        },

        hideSuccessAlert() {
            this.successAlert.show = false;
        }
    },
    mounted() {
        // Load data when component mounted
        this.loadDataFromSource();

        // Listen for data loaded event
        window.addEventListener('dataBahanAjarLoaded', () => {
            this.loadDataFromSource();
        });
    }
});
