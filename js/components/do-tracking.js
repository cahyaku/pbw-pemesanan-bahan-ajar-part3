/**
 * tracking-app.js - Vue App untuk Tracking Pengiriman Page
 * Standalone Vue application dengan semua logic tracking
 */

document.addEventListener('DOMContentLoaded', function () {
    // Periksa apakah pengguna sudah login
    if (!isLoggedIn()) {
        window.location.href = '../index.html';
        return;
    }

    // Inisialisasi Vue App untuk Tracking
    new Vue({
        el: '#app',
        data: {
            // Informasi pengguna
            userName: 'User',

            // Data dari dataBahanAjar.js
            paketList: [],
            stokList: [],
            trackingData: {},

            // Pencarian
            searchDO: '',

            // Status tampilan
            showResults: false,
            showNoResults: false,
            selectedTracking: null,

            // Data form untuk tambah DO
            formData: {
                nomorDO: '',
                nim: '',
                nama: '',
                ekspedisi: '',
                paketKode: '',
                tanggalKirim: '',
                status: 'Diproses',
                total: 0
            },

            // Paket yang dipilih
            selectedPaket: null,

            // Instance modal Bootstrap
            modalInstance: null,

            // Sistem alert
            alert: {
                show: false,
                type: '',
                title: '',
                message: '',
                icon: '',
                timeout: null
            },

            // Alert form
            formAlert: {
                show: false,
                type: '',
                title: '',
                message: '',
                icon: ''
            },

            // Alert sukses
            successAlert: {
                show: false,
                title: '',
                message: ''
            },

            // Alert peringatan
            warningAlert: {
                show: false,
                title: '',
                message: ''
            }
        },

        computed: {
            /**
             * Generate nomor DO otomatis
             */
            nextDONumber() {
                const year = new Date().getFullYear();
                const existingDOs = Object.keys(this.trackingData);

                const currentYearDOs = existingDOs.filter(doNum =>
                    doNum.startsWith(`DO${year}-`)
                );

                let maxSequence = 0;
                currentYearDOs.forEach(doNum => {
                    const parts = doNum.split('-');
                    if (parts.length === 2) {
                        const seq = parseInt(parts[1]);
                        if (seq > maxSequence) {
                            maxSequence = seq;
                        }
                    }
                });

                const nextSequence = maxSequence + 1;
                return `DO${year}-${String(nextSequence).padStart(4, '0')}`;
            },

            /**
             * Convert trackingData object to array
             */
            trackingList() {
                const list = Object.keys(this.trackingData).map(doNumber => {
                    return {
                        nomorDO: doNumber,
                        ...this.trackingData[doNumber]
                    };
                });

                return list.sort((a, b) => {
                    return b.nomorDO.localeCompare(a.nomorDO);
                });
            }
        },

        watch: {
            'formData.paketKode'(newValue) {
                if (newValue) {
                    this.updateSelectedPaket();
                } else {
                    this.selectedPaket = null;
                    this.formData.total = 0;
                }
            }
        },

        methods: {
            /**
             * Handle pencarian tracking
             */
            handleTracking() {
                const doNumber = this.searchDO.trim();

                if (!doNumber) {
                    this.showAlert('warning', 'Input Kosong!', 'Harap masukkan nomor Delivery Order!');
                    return;
                }

                if (!/^DO\d{4}-\d{4}$/.test(doNumber)) {
                    this.showAlert('warning', 'Format Salah!', 'Format nomor DO harus: DO2025-0001');
                    return;
                }

                if (this.trackingData[doNumber]) {
                    this.displayTrackingResults(this.trackingData[doNumber]);
                } else {
                    this.displayNoResults();
                    this.showWarningAlert('Data Tidak Ditemukan!', `Nomor DO ${doNumber} tidak ditemukan dalam sistem.`);
                }
            },

            /**
             * Tampilkan hasil tracking
             */
            displayTrackingResults(data) {
                this.selectedTracking = data;
                this.showResults = true;
                this.showNoResults = false;

                this.$nextTick(() => {
                    const element = document.querySelector('.card');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            },

            /**
             * Tampilkan no results
             */
            displayNoResults() {
                this.selectedTracking = null;
                this.showResults = false;
                this.showNoResults = true;
            },

            /**
             * Close results
             */
            closeResults() {
                this.showResults = false;
                this.showNoResults = false;
                this.selectedTracking = null;
                this.searchDO = '';
            },

            /**
             * View tracking dari tabel
             */
            viewTracking(nomorDO) {
                this.searchDO = nomorDO;

                if (this.trackingData[nomorDO]) {
                    this.displayTrackingResults(this.trackingData[nomorDO]);

                    this.$nextTick(() => {
                        const element = document.querySelector('.card');
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    });
                } else {
                    this.displayNoResults();
                }
            },

            /**
             * Get status badge class
             */
            getStatusBadgeClass(status) {
                if (!status) return 'bg-secondary';

                switch (status.toLowerCase()) {
                    case 'diterima':
                        return 'bg-info';
                    case 'diproses':
                        return 'bg-warning text-dark';
                    case 'dalam perjalanan':
                        return 'bg-primary';
                    case 'dikirim':
                        return 'bg-success';
                    case 'selesai':
                        return 'bg-success';
                    default:
                        return 'bg-secondary';
                }
            },

            /**
             * Format date
             */
            formatDate(dateString) {
                if (!dateString) return '-';
                const date = new Date(dateString);
                return date.toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            },

            /**
             * Format datetime
             */
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
            },

            /**
             * Show modal tambah DO
             */
            showAddDOModal() {
                this.resetFormData();
                this.formData.nomorDO = this.nextDONumber;
                this.formData.tanggalKirim = this.getCurrentDate();
                this.selectedPaket = null;
                this.openModal();
            },

            /**
             * Update selected paket
             */
            updateSelectedPaket() {
                const paket = this.paketList.find(p => p.kode === this.formData.paketKode);

                if (paket) {
                    this.selectedPaket = paket;
                    this.formData.total = paket.harga;
                } else {
                    this.selectedPaket = null;
                    this.formData.total = 0;
                }
            },

            /**
             * Get matkul name
             */
            getMatkulName(kode) {
                const matkul = this.stokList.find(s => s.kode === kode);
                return matkul ? matkul.judul : 'Tidak ditemukan';
            },

            /**
             * Get current date
             */
            getCurrentDate() {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            },

            /**
             * Save DO
             */
            saveDO() {
                try {
                    if (!this.validateForm()) {
                        return;
                    }

                    const paket = this.paketList.find(p => p.kode === this.formData.paketKode);
                    const paketName = paket ? `${paket.kode} - ${paket.nama}` : this.formData.paketKode;

                    const newTracking = {
                        nomorDO: this.formData.nomorDO,
                        nim: this.formData.nim,
                        nama: this.formData.nama,
                        status: this.formData.status,
                        ekspedisi: this.formData.ekspedisi,
                        tanggalKirim: this.formData.tanggalKirim,
                        paket: paketName,
                        total: this.formData.total,
                        perjalanan: [
                            {
                                waktu: new Date().toISOString(),
                                keterangan: `DO dibuat dengan status: ${this.formData.status}`
                            }
                        ]
                    };

                    this.$set(this.trackingData, this.formData.nomorDO, newTracking);

                    if (typeof dataBahanAjarSource !== 'undefined' && dataBahanAjarSource.tracking) {
                        dataBahanAjarSource.tracking[this.formData.nomorDO] = newTracking;
                    }

                    this.closeModal();
                    this.showSuccessAlert('Berhasil!', `Delivery Order ${this.formData.nomorDO} berhasil ditambahkan.`);

                    this.searchDO = newTracking.nomorDO;
                    if (this.trackingData[newTracking.nomorDO]) {
                        this.displayTrackingResults(this.trackingData[newTracking.nomorDO]);
                    }

                } catch (error) {
                    this.showFormAlert('danger', 'Gagal Menyimpan!', 'Terjadi kesalahan saat menyimpan data.');
                }
            },

            /**
             * Validate form
             */
            validateForm() {
                this.hideFormAlert();

                if (!this.formData.nim || !this.formData.nama) {
                    this.showFormAlert('warning', 'Data Tidak Lengkap!', 'NIM dan Nama harus diisi!');
                    return false;
                }

                if (!this.formData.ekspedisi) {
                    this.showFormAlert('warning', 'Data Tidak Lengkap!', 'Ekspedisi harus dipilih!');
                    return false;
                }

                if (!this.formData.paketKode) {
                    this.showFormAlert('warning', 'Data Tidak Lengkap!', 'Paket Bahan Ajar harus dipilih!');
                    return false;
                }

                if (!this.formData.tanggalKirim) {
                    this.showFormAlert('warning', 'Data Tidak Lengkap!', 'Tanggal Kirim harus diisi!');
                    return false;
                }

                if (!/^\d{8,}$/.test(this.formData.nim)) {
                    this.showFormAlert('warning', 'Format Salah!', 'NIM harus berupa angka minimal 8 digit!');
                    return false;
                }

                const selectedDate = new Date(this.formData.tanggalKirim);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                    this.showFormAlert('warning', 'Tanggal Tidak Valid!', 'Tanggal kirim tidak boleh di masa lalu!');
                    return false;
                }

                return true;
            },

            /**
             * Reset form data
             */
            resetFormData() {
                this.formData = {
                    nomorDO: '',
                    nim: '',
                    nama: '',
                    ekspedisi: '',
                    paketKode: '',
                    tanggalKirim: '',
                    status: 'Diproses',
                    total: 0
                };
                this.selectedPaket = null;
            },

            /**
             * Open modal
             */
            openModal() {
                const modalEl = document.getElementById('addDOModal');
                if (!this.modalInstance) {
                    this.modalInstance = new bootstrap.Modal(modalEl);
                }
                this.modalInstance.show();
            },

            /**
             * Close modal
             */
            closeModal() {
                if (this.modalInstance) {
                    this.modalInstance.hide();
                }
                this.hideFormAlert();
                this.resetFormData();
            },

            /**
             * Logout
             */
            logout() {
                sessionStorage.removeItem('currentUser');
                window.location.href = '../index.html';
            },

            /**
             * Show alert
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
            },

            showWarningAlert(title, message) {
                this.warningAlert = { show: true, title, message };
            },

            hideWarningAlert() {
                this.warningAlert.show = false;
            },

            /**
             * Load data from source
             */
            loadDataFromSource() {
                if (typeof dataBahanAjarSource !== 'undefined') {
                    this.paketList = Array.isArray(dataBahanAjarSource.paket) ?
                        [...dataBahanAjarSource.paket] : [];

                    this.stokList = Array.isArray(dataBahanAjarSource.stok) ?
                        [...dataBahanAjarSource.stok] : [];

                    this.trackingData = dataBahanAjarSource.tracking ?
                        Object.assign({}, dataBahanAjarSource.tracking) : {};
                } else {
                    this.paketList = [];
                    this.stokList = [];
                    this.trackingData = {};
                }
            }
        },

        mounted() {
            this.loadDataFromSource();

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
