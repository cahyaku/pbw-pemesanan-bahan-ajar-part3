/**
 * stok-app.js - Vue App untuk Stok Bahan Ajar Page
 * Standalone Vue application dengan semua logic stok management
 * Data source: dataBahanAjar.json (via dataBahanAjarSource)
 */

document.addEventListener('DOMContentLoaded', function () {
    // Periksa apakah pengguna sudah login
    if (!isLoggedIn()) {
        window.location.href = '../index.html';
        return;
    }

    // Inisialisasi Vue App untuk Stok
    new Vue({
        el: '#app',
        data: {
            // Data dari dataBahanAjar.js
            upbjjList: [],
            kategoriList: [],
            stok: [],

            // Informasi pengguna
            userName: 'User',

            // Properti filter (two-way data binding dengan v-model)
            searchQuery: '',
            filterKategori: '',
            filterUpbjj: '',
            sortBy: '',

            // Data form untuk tambah/edit
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

            // Status modal
            editMode: false,
            editIndex: -1,

            // Delete confirmation
            deleteItem: null,
            deleteIndex: -1,

            // Sistem alert
            alert: {
                show: false,
                type: '',
                title: '',
                message: '',
                icon: '',
                timeout: null
            },

            // Alert form untuk error/warning di dalam modal
            formAlert: {
                show: false,
                type: '',
                title: '',
                message: '',
                icon: ''
            },

            // Alert sukses untuk ditampilkan di tengah layar
            successAlert: {
                show: false,
                title: '',
                message: ''
            }
        },

        computed: {
            /**
             * Filter stok berdasarkan kata kunci pencarian, kategori, dan upbjj
             */
            filteredStok() {
                let result = this.stok;

                // Filter berdasarkan kata kunci pencarian
                if (this.searchQuery) {
                    const query = this.searchQuery.toLowerCase();
                    result = result.filter(item =>
                        item.kode.toLowerCase().includes(query) ||
                        item.judul.toLowerCase().includes(query)
                    );
                }

                // Filter berdasarkan kategori
                if (this.filterKategori) {
                    result = result.filter(item => item.kategori === this.filterKategori);
                }

                // Filter berdasarkan UPBJJ
                if (this.filterUpbjj) {
                    result = result.filter(item => item.upbjj === this.filterUpbjj);
                }

                // Pengurutan berdasarkan pilihan
                if (this.sortBy) {
                    const [field, order] = this.sortBy.split('-');

                    result = [...result].sort((a, b) => {
                        let valueA, valueB;

                        if (field === 'judul') {
                            valueA = a.judul.toLowerCase();
                            valueB = b.judul.toLowerCase();

                            if (order === 'asc') {
                                return valueA.localeCompare(valueB);
                            } else {
                                return valueB.localeCompare(valueA);
                            }
                        } else if (field === 'qty' || field === 'harga') {
                            valueA = a[field];
                            valueB = b[field];

                            if (order === 'asc') {
                                return valueA - valueB;
                            } else {
                                return valueB - valueA;
                            }
                        }

                        return 0;
                    });
                }

                return result;
            },

            /**
             * Pesan peringatan ketika stok di bawah safety stock
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
             * Mendapatkan kelas CSS untuk warna stok
             */
            getStockClass(qty) {
                if (qty === 0) {
                    return 'text-danger';
                } else if (qty <= 10) {
                    return 'text-warning';
                } else {
                    return 'text-success';
                }
            },

            /**
             * RESET semua filter
             */
            resetFilters() {
                this.searchQuery = '';
                this.filterKategori = '';
                this.filterUpbjj = '';
                this.sortBy = '';
            },

            /**
             * Menampilkan modal untuk tambah stok baru
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
             * Menampilkan modal untuk edit stok
             */
            editStock(index) {
                this.editMode = true;

                // Cari indeks asli di array stok
                const item = this.filteredStok[index];
                this.editIndex = this.stok.findIndex(s => s.kode === item.kode);

                // Isi form dengan data yang ada
                this.formData = { ...item };

                this.hideFormAlert();
                this.$nextTick(() => {
                    if (this.$refs.stockModal) {
                        this.$refs.stockModal.show();
                    }
                });
            },

            /**
             * Menampilkan modal konfirmasi untuk hapus stok
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
             * Konfirmasi hapus stok
             */
            confirmDelete() {
                try {
                    if (this.deleteIndex >= 0 && this.deleteItem) {
                        const deletedItem = this.stok[this.deleteIndex];

                        // Hapus dari array
                        this.stok.splice(this.deleteIndex, 1);

                        // Update dataBahanAjarSource jika ada
                        if (typeof dataBahanAjarSource !== 'undefined' && Array.isArray(dataBahanAjarSource.stok)) {
                            const sourceIndex = dataBahanAjarSource.stok.findIndex(s => s.kode === deletedItem.kode);
                            if (sourceIndex >= 0) {
                                dataBahanAjarSource.stok.splice(sourceIndex, 1);
                            }
                        }

                        // Tutup modal delete
                        if (this.$refs.deleteModal) {
                            this.$refs.deleteModal.hide();
                        }

                        // Tampilkan success alert
                        this.showSuccessAlert('Berhasil Dihapus!', `Data ${deletedItem.kode} - ${deletedItem.judul} berhasil dihapus dari sistem.`);

                        // Reset delete data
                        this.deleteItem = null;
                        this.deleteIndex = -1;
                    }
                } catch (error) {
                    console.error('Error deleting stock:', error);
                    this.showAlert('danger', 'Gagal Menghapus!', 'Terjadi kesalahan saat menghapus data stok.');
                }
            },

            /**
             * Batal hapus stok
             */
            cancelDelete() {
                this.deleteItem = null;
                this.deleteIndex = -1;
            },

            /**
             * Method untuk menyimpan stok (tambah atau edit)
             */
            saveStock() {
                try {
                    // Validasi form
                    if (!this.validateForm()) {
                        return;
                    }

                    if (this.editMode) {
                        // Update stok yang ada
                        this.$set(this.stok, this.editIndex, { ...this.formData });

                        // Update dataBahanAjarSource jika ada
                        if (typeof dataBahanAjarSource !== 'undefined' && Array.isArray(dataBahanAjarSource.stok)) {
                            const sourceIndex = dataBahanAjarSource.stok.findIndex(s => s.kode === this.formData.kode);
                            if (sourceIndex >= 0) {
                                dataBahanAjarSource.stok[sourceIndex] = { ...this.formData };
                            }
                        }

                        // Tutup modal menggunakan component ref
                        if (this.$refs.stockModal) {
                            this.$refs.stockModal.hide();
                        }

                        // Tampilkan success alert
                        this.showSuccessAlert('Berhasil!', `Stok bahan ajar ${this.formData.kode} berhasil diupdate.`);
                    } else {
                        // Cek duplikasi kode
                        const exists = this.stok.some(item => item.kode === this.formData.kode);
                        if (exists) {
                            this.showFormAlert('warning', 'Kode Sudah Ada!', 'Kode mata kuliah sudah ada dalam sistem!');
                            return;
                        }

                        // Tambah stok baru
                        this.stok.push({ ...this.formData });

                        // Update dataBahanAjarSource jika ada
                        if (typeof dataBahanAjarSource !== 'undefined' && Array.isArray(dataBahanAjarSource.stok)) {
                            dataBahanAjarSource.stok.push({ ...this.formData });
                        }

                        // Tutup modal menggunakan component ref
                        if (this.$refs.stockModal) {
                            this.$refs.stockModal.hide();
                        }

                        // Tampilkan success alert
                        this.showSuccessAlert('Berhasil!', `Stok bahan ajar ${this.formData.kode} berhasil ditambahkan ke sistem.`);
                    }

                } catch (error) {
                    console.error('Error saving stock:', error);
                    this.showFormAlert('danger', 'Gagal Menyimpan!', 'Terjadi kesalahan saat menyimpan data stok. Silakan coba lagi.');
                }
            },

            /**
             * Validasi form sebelum submit
             */
            validateForm() {
                // Sembunyikan form alert sebelum validasi
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

                // Validasi format kode mata kuliah
                if (!/^[A-Z]{4}\d{4}$/.test(this.formData.kode)) {
                    this.showFormAlert('warning', 'Format Salah!', 'Format kode mata kuliah harus: 4 huruf + 4 angka (contoh: EKMA4116)!');
                    return false;
                }

                return true;
            },

            /**
             * Reset data form ke nilai default
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
             * Tampilkan pesan alert
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

            /**
             * Sembunyikan pesan alert
             */
            hideAlert() {
                this.alert.show = false;
                if (this.alert.timeout) {
                    clearTimeout(this.alert.timeout);
                    this.alert.timeout = null;
                }
            },

            /**
             * Tampilkan alert form
             */
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

            /**
             * Sembunyikan alert form
             */
            hideFormAlert() {
                this.formAlert.show = false;
            },

            /**
             * Tampilkan/sembunyikan alert sukses
             */
            showSuccessAlert(title, message) {
                this.successAlert = { show: true, title, message };
            },

            hideSuccessAlert() {
                this.successAlert.show = false;
            },

            /**
             * Fungsi keluar dari sistem
             */
            logout() {
                sessionStorage.removeItem('currentUser');
                window.location.href = '../index.html';
            },

            /**
             * Muat data dari dataBahanAjar.js
             */
            loadDataFromSource() {
                if (typeof dataBahanAjarSource !== 'undefined') {
                    this.upbjjList = dataBahanAjarSource.upbjjList || [];
                    this.kategoriList = dataBahanAjarSource.kategoriList || [];
                    this.stok = dataBahanAjarSource.stok || [];
                } else {
                    console.warn('dataBahanAjarSource tidak ditemukan, menggunakan data kosong');
                    this.upbjjList = [];
                    this.kategoriList = [];
                    this.stok = [];
                }
            }
        },

        mounted() {
            // Muat data saat komponen di-mount
            this.loadDataFromSource();

            // Muat informasi pengguna
            const user = getCurrentUser();
            if (user) {
                this.userName = user.nama;
            }
        }
    });
});

// Utility functions
function isLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}
