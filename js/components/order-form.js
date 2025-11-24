/**
 * order-form.js - Vue Component untuk Form Pemesanan/DO
 * Custom element: <order-form>
 * Template ID: tpl-order-form
 */

Vue.component('order-form', {
    template: `
        <div class="order-form-component">
            <!-- Alert di dalam form -->
            <div v-if="formAlert.show" 
                 class="alert" 
                 :class="formAlert.type" 
                 role="alert">
                <div class="d-flex align-items-center">
                    <i :class="formAlert.icon" class="me-2"></i>
                    <div>
                        <strong>{{ formAlert.title }}</strong>
                        <div class="mt-1">{{ formAlert.message }}</div>
                    </div>
                    <button type="button" 
                            class="btn-close ms-auto" 
                            @click="hideFormAlert">
                    </button>
                </div>
            </div>

            <form @submit.prevent="handleSubmit">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Nomor DO</label>
                        <input type="text" 
                               class="form-control" 
                               v-model="localFormData.nomorDO" 
                               readonly>
                        <small class="text-muted">Tergenerate otomatis</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">NIM <span class="text-danger">*</span></label>
                        <input type="text" 
                               class="form-control" 
                               v-model.trim="localFormData.nim"
                               placeholder="Masukkan NIM" 
                               required>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12 mb-3">
                        <label class="form-label">Nama Lengkap <span class="text-danger">*</span></label>
                        <input type="text" 
                               class="form-control" 
                               v-model.trim="localFormData.nama"
                               placeholder="Masukkan nama lengkap" 
                               required>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Ekspedisi <span class="text-danger">*</span></label>
                        <select class="form-select" 
                                v-model="localFormData.ekspedisi" 
                                required>
                            <option value="">Pilih Ekspedisi</option>
                            <option value="JNE Regular">JNE Regular</option>
                            <option value="JNE Express">JNE Express</option>
                            <option value="Pos Indonesia">Pos Indonesia</option>
                            <option value="SiCepat">SiCepat</option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Tanggal Kirim <span class="text-danger">*</span></label>
                        <input type="date" 
                               class="form-control" 
                               v-model="localFormData.tanggalKirim" 
                               required>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12 mb-3">
                        <label class="form-label">Paket Bahan Ajar <span class="text-danger">*</span></label>
                        <select class="form-select" 
                                v-model="localFormData.paketKode" 
                                required>
                            <option value="">Pilih Paket</option>
                            <option v-for="paket in paketList" 
                                    :key="paket.kode" 
                                    :value="paket.kode">
                                {{ paket.kode }} - {{ paket.nama }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Detail Isi Paket -->
                <div class="row">
                    <div class="col-12 mb-3">
                        <div class="alert alert-info">
                            <h6 class="alert-heading">
                                <i class="bi bi-box-seam me-2"></i>Detail Isi Paket:
                            </h6>

                            <div v-if="selectedPaket">
                                <ul class="mb-2">
                                    <li v-for="(kode, index) in selectedPaket.isi" :key="index">
                                        <strong>{{ kode }}</strong> - {{ getMatkulName(kode) }}
                                    </li>
                                </ul>
                                <hr>
                                <p class="mb-0">
                                    <strong>Total Harga:</strong>
                                    <span class="text-success fw-bold">
                                        {{ formatCurrency(selectedPaket.harga) }}
                                    </span>
                                </p>
                            </div>

                            <div v-else>
                                <p class="mb-1"><strong>Kode:</strong> -</p>
                                <p class="mb-0"><strong>Total Harga:</strong> -</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `,
    props: {
        formData: {
            type: Object,
            required: true
        },
        paketList: {
            type: Array,
            required: true
        },
        stokList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            localFormData: { ...this.formData },
            formAlert: {
                show: false,
                type: '',
                title: '',
                message: '',
                icon: ''
            }
        };
    },
    computed: {
        selectedPaket() {
            if (!this.localFormData.paketKode) return null;
            return this.paketList.find(p => p.kode === this.localFormData.paketKode) || null;
        }
    },
    watch: {
        formData: {
            handler(newVal) {
                this.localFormData = { ...newVal };
            },
            deep: true
        },
        localFormData: {
            handler(newVal) {
                this.$emit('update:formData', newVal);
            },
            deep: true
        },
        'localFormData.paketKode'(newValue) {
            if (newValue && this.selectedPaket) {
                this.localFormData.total = this.selectedPaket.harga;
            } else {
                this.localFormData.total = 0;
            }
        }
    },
    methods: {
        formatCurrency(value) {
            return 'Rp ' + value.toLocaleString('id-ID');
        },

        getMatkulName(kode) {
            const matkul = this.stokList.find(s => s.kode === kode);
            return matkul ? matkul.judul : 'Tidak ditemukan';
        },

        handleSubmit() {
            this.$emit('submit', this.localFormData);
        },

        showFormAlert(type, title, message) {
            const iconMap = {
                danger: 'bi bi-exclamation-triangle-fill',
                warning: 'bi bi-exclamation-triangle-fill',
                info: 'bi bi-info-circle-fill'
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

        validate() {
            this.hideFormAlert();

            if (!this.localFormData.nim || !this.localFormData.nama) {
                this.showFormAlert('warning', 'Data Tidak Lengkap!', 'NIM dan Nama harus diisi!');
                return false;
            }

            if (!this.localFormData.ekspedisi) {
                this.showFormAlert('warning', 'Data Tidak Lengkap!', 'Ekspedisi harus dipilih!');
                return false;
            }

            if (!this.localFormData.paketKode) {
                this.showFormAlert('warning', 'Data Tidak Lengkap!', 'Paket Bahan Ajar harus dipilih!');
                return false;
            }

            if (!this.localFormData.tanggalKirim) {
                this.showFormAlert('warning', 'Data Tidak Lengkap!', 'Tanggal Kirim harus diisi!');
                return false;
            }

            // Validasi format NIM
            if (!/^\d{8,}$/.test(this.localFormData.nim)) {
                this.showFormAlert('warning', 'Format Salah!', 'NIM harus berupa angka minimal 8 digit!');
                return false;
            }

            // Validasi tanggal
            const selectedDate = new Date(this.localFormData.tanggalKirim);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                this.showFormAlert('warning', 'Tanggal Tidak Valid!', 'Tanggal kirim tidak boleh di masa lalu!');
                return false;
            }

            return true;
        }
    }
});
