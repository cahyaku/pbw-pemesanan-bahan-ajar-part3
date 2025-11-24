/**
 * api.js - Data Service untuk mengakses JSON data
 * Menangani fetch dan akses data dari dataBahanAjar.json atau dataBahanAjar.js
 */

const DataService = {
    /**
     * Base data source - menggunakan dataBahanAjarSource dari dataBahanAjar.js
     */
    dataSource: null,

    /**
     * Inisialisasi data service
     */
    init() {
        // Gunakan dataBahanAjarSource yang sudah di-load dari dataBahanAjar.js
        if (typeof dataBahanAjarSource !== 'undefined') {
            this.dataSource = dataBahanAjarSource;
        } else {
            console.error('dataBahanAjarSource tidak ditemukan!');
            this.dataSource = this.getEmptyData();
        }
    },

    /**
     * Get empty data structure
     */
    getEmptyData() {
        return {
            upbjjList: [],
            kategoriList: [],
            pengirimanList: [],
            paket: [],
            stok: [],
            tracking: {}
        };
    },

    /**
     * Fetch all data atau load dari JSON file
     * @returns {Promise<Object>} Data bahan ajar
     */
    async fetchAllData() {
        try {
            // Coba load dari file JSON jika ada
            const response = await fetch('../data/dataBahanAjar.json');
            if (response.ok) {
                const data = await response.json();
                this.dataSource = data;
                return data;
            }
        } catch (error) {
            console.log('Menggunakan data dari dataBahanAjar.js');
        }

        // Fallback ke dataBahanAjarSource
        this.init();
        return this.dataSource;
    },

    /**
     * Get daftar UPBJJ
     * @returns {Array} List UPBJJ
     */
    getUpbjjList() {
        return this.dataSource?.upbjjList || [];
    },

    /**
     * Get daftar kategori
     * @returns {Array} List kategori
     */
    getKategoriList() {
        return this.dataSource?.kategoriList || [];
    },

    /**
     * Get daftar pengiriman
     * @returns {Array} List jenis pengiriman
     */
    getPengirimanList() {
        return this.dataSource?.pengirimanList || [];
    },

    /**
     * Get daftar paket
     * @returns {Array} List paket
     */
    getPaketList() {
        return this.dataSource?.paket || [];
    },

    /**
     * Get paket by kode
     * @param {string} kode - Kode paket
     * @returns {Object|null} Data paket
     */
    getPaketByKode(kode) {
        const paketList = this.getPaketList();
        return paketList.find(p => p.kode === kode) || null;
    },

    /**
     * Get daftar stok
     * @returns {Array} List stok
     */
    getStokList() {
        return this.dataSource?.stok || [];
    },

    /**
     * Get stok by kode
     * @param {string} kode - Kode mata kuliah
     * @returns {Object|null} Data stok
     */
    getStokByKode(kode) {
        const stokList = this.getStokList();
        return stokList.find(s => s.kode === kode) || null;
    },

    /**
     * Add atau update stok
     * @param {Object} stokData - Data stok
     * @returns {boolean} Success status
     */
    saveStok(stokData) {
        try {
            const stokList = this.getStokList();
            const index = stokList.findIndex(s => s.kode === stokData.kode);

            if (index >= 0) {
                // Update existing
                stokList[index] = { ...stokData };
            } else {
                // Add new
                stokList.push({ ...stokData });
            }

            return true;
        } catch (error) {
            console.error('Error saving stok:', error);
            return false;
        }
    },

    /**
     * Delete stok by kode
     * @param {string} kode - Kode mata kuliah
     * @returns {boolean} Success status
     */
    deleteStok(kode) {
        try {
            const stokList = this.getStokList();
            const index = stokList.findIndex(s => s.kode === kode);

            if (index >= 0) {
                stokList.splice(index, 1);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting stok:', error);
            return false;
        }
    },

    /**
     * Get tracking data
     * @returns {Object} Tracking data object
     */
    getTrackingData() {
        return this.dataSource?.tracking || {};
    },

    /**
     * Get tracking by nomor DO
     * @param {string} nomorDO - Nomor delivery order
     * @returns {Object|null} Data tracking
     */
    getTrackingByDO(nomorDO) {
        const trackingData = this.getTrackingData();
        return trackingData[nomorDO] || null;
    },

    /**
     * Save tracking data
     * @param {string} nomorDO - Nomor delivery order
     * @param {Object} trackingInfo - Data tracking
     * @returns {boolean} Success status
     */
    saveTracking(nomorDO, trackingInfo) {
        try {
            const trackingData = this.getTrackingData();
            trackingData[nomorDO] = { ...trackingInfo };
            return true;
        } catch (error) {
            console.error('Error saving tracking:', error);
            return false;
        }
    },

    /**
     * Get all tracking as array
     * @returns {Array} List tracking
     */
    getTrackingList() {
        const trackingData = this.getTrackingData();
        return Object.keys(trackingData).map(nomorDO => ({
            nomorDO,
            ...trackingData[nomorDO]
        }));
    },

    /**
     * Filter stok dengan kriteria
     * @param {Object} criteria - Kriteria filter
     * @returns {Array} Filtered stok list
     */
    filterStok(criteria = {}) {
        let result = this.getStokList();

        // Filter by search query
        if (criteria.search) {
            const query = criteria.search.toLowerCase();
            result = result.filter(item =>
                item.kode.toLowerCase().includes(query) ||
                item.judul.toLowerCase().includes(query)
            );
        }

        // Filter by kategori
        if (criteria.kategori) {
            result = result.filter(item => item.kategori === criteria.kategori);
        }

        // Filter by upbjj
        if (criteria.upbjj) {
            result = result.filter(item => item.upbjj === criteria.upbjj);
        }

        // Filter by stock status
        if (criteria.stockStatus) {
            if (criteria.stockStatus === 'habis') {
                result = result.filter(item => item.qty === 0);
            } else if (criteria.stockStatus === 'rendah') {
                result = result.filter(item => item.qty > 0 && item.qty < item.safety);
            } else if (criteria.stockStatus === 'tersedia') {
                result = result.filter(item => item.qty >= item.safety);
            }
        }

        return result;
    },

    /**
     * Sort stok
     * @param {Array} stokList - List stok
     * @param {string} sortBy - Field untuk sorting (format: field-order)
     * @returns {Array} Sorted stok list
     */
    sortStok(stokList, sortBy) {
        if (!sortBy) return stokList;

        const [field, order] = sortBy.split('-');

        return [...stokList].sort((a, b) => {
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
};

// Initialize data service saat file di-load
if (typeof dataBahanAjarSource !== 'undefined') {
    DataService.init();
}

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataService;
}
