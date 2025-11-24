/**
 * dataBahanAjar.js - Data loader untuk dataBahanAjar.json
 * Loads data from JSON file dan expose sebagai global variable
 */

// Global variable untuk menyimpan data dari dataBahanAjar.json
var dataBahanAjarSource = null;

// Load data dari JSON file menggunakan fetch API
(function loadDataBahanAjar() {
    // Untuk development, kita load dari JSON file
    fetch('../data/dataBahanAjar.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            dataBahanAjarSource = data;
            console.log('✅ Data Bahan Ajar loaded successfully:', data);

            // Dispatch custom event untuk memberitahu bahwa data sudah ready
            window.dispatchEvent(new CustomEvent('dataBahanAjarLoaded', { detail: data }));
        })
        .catch(error => {
            console.error('❌ Error loading dataBahanAjar.json:', error);

            // Fallback data jika gagal load JSON
            dataBahanAjarSource = {
                upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
                kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
                pengirimanList: [
                    { kode: "REG", nama: "Reguler (3-5 hari)" },
                    { kode: "EXP", nama: "Ekspres (1-2 hari)" }
                ],
                paket: [],
                stok: [],
                tracking: []
            };

            console.warn('⚠️ Using fallback empty data');
        });
})();
