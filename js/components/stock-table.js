/**
 * stock-table.js - Vue Component untuk Tabel Stok Bahan Ajar
 * Custom element: <stock-table>
 * Template ID: tpl-stock-table
 */

Vue.component('stock-table', {
    template: `
        <div class="stock-table-component">
            <div class="card">
                <div class="card-header bg-gradient text-white">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-table me-2"></i>Daftar Stok Bahan Ajar
                            <span class="badge bg-light text-dark ms-2">{{ stokData.length }} item</span>
                        </h5>
                        <button class="btn fw-bold"
                            style="background-color: #FFF9C4; border-color: #FFF9C4; color: #333;"
                            @click="handleAddNew">
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
                                <tr v-if="stokData.length === 0">
                                    <td colspan="12" class="text-center text-muted py-4">
                                        <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                                        Tidak ada data stok bahan ajar yang ditemukan
                                    </td>
                                </tr>
                                <tr v-else v-for="(item, index) in stokData" :key="item.kode">
                                    <td>{{ index + 1 }}</td>
                                    <td><span class="badge bg-secondary">{{ item.kode }}</span></td>
                                    <td>{{ item.judul }}</td>
                                    <td>{{ formatCurrency(item.harga) }}</td>
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
                                        <button class="btn btn-sm btn-outline-primary"
                                            @click="handleEdit(index)" 
                                            title="Edit">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: {
        stokData: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    methods: {
        /**
         * Format currency ke format Rupiah
         */
        formatCurrency(value) {
            return 'Rp ' + value.toLocaleString('id-ID');
        },

        /**
         * Get CSS class untuk warna stok
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
         * Handle add new stock
         */
        handleAddNew() {
            this.$emit('add-new');
        },

        /**
         * Handle edit stock
         */
        handleEdit(index) {
            this.$emit('edit-stock', index);
        }
    }
});
