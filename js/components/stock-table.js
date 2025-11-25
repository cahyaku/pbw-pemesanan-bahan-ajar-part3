/**
 * stock-table.js - Vue Component untuk Stok Bahan Ajar Management
 * Complete CRUD component dengan filter, sort, dan modal management
 * Custom element: <stock-table>
 * Template: Loaded from /templates/stok-table-template.html
 */

// Fetch template HTML dari file eksternal
fetch('../templates/stok-table-template.html')
    .then(response => response.text())
    .then(template => {
        // Registrasi komponen <stock-table> ke Vue
        Vue.component('stock-table', {
            template: template,
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
                filteredStok() {
                    let result = this.stok;

                    if (this.searchQuery) {
                        const query = this.searchQuery.toLowerCase();
                        result = result.filter(item =>
                            item.kode.toLowerCase().includes(query) ||
                            item.judul.toLowerCase().includes(query)
                        );
                    }

                    if (this.filterKategori) {
                        result = result.filter(item => item.kategori === this.filterKategori);
                    }

                    if (this.filterUpbjj) {
                        result = result.filter(item => item.upbjj === this.filterUpbjj);
                    }

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
                loadDataFromSource() {
                    if (typeof dataBahanAjarSource !== 'undefined' && dataBahanAjarSource) {
                        this.upbjjList = dataBahanAjarSource.upbjjList || [];
                        this.kategoriList = dataBahanAjarSource.kategoriList || [];
                        this.stok = dataBahanAjarSource.stok || [];
                    } else {
                        console.warn('dataBahanAjarSource not ready, will retry...');
                        setTimeout(() => this.loadDataFromSource(), 500);
                    }
                },

                getStockClass(qty) {
                    if (qty === 0) return 'text-danger';
                    else if (qty <= 10) return 'text-warning';
                    else return 'text-success';
                },

                formatCurrency(value) {
                    return 'Rp ' + value.toLocaleString('id-ID');
                },

                resetFilters() {
                    this.searchQuery = '';
                    this.filterKategori = '';
                    this.filterUpbjj = '';
                    this.sortBy = '';
                },

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

                confirmDelete() {
                    try {
                        if (this.deleteIndex >= 0 && this.deleteItem) {
                            const deletedItem = this.stok[this.deleteIndex];
                            this.stok.splice(this.deleteIndex, 1);

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

                cancelDelete() {
                    this.deleteItem = null;
                    this.deleteIndex = -1;
                },

                saveStock() {
                    try {
                        if (!this.validateForm()) {
                            return;
                        }

                        if (this.editMode) {
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

                handleModalCancel() {
                    this.hideFormAlert();
                    this.resetFormData();
                },

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
                this.loadDataFromSource();

                window.addEventListener('dataBahanAjarLoaded', () => {
                    this.loadDataFromSource();
                });
            }
        });
    })
    .catch(error => {
        console.error('Error loading stock-table template:', error);
    });
