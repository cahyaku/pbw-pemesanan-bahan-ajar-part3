/**
 * status-badge.js - Vue Component untuk Status Badge
 * Custom element: <status-badge>
 * Template ID: tpl-status-badge
 */

Vue.component('status-badge', {
    template: `
        <span class="badge status-badge" :class="badgeClass">
            {{ statusText }}
        </span>
    `,
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
    computed: {
        /**
         * Get status text berdasarkan item atau status prop
         */
        statusText() {
            // Jika prop status langsung diberikan (untuk tracking)
            if (this.status) {
                return this.status;
            }

            // Jika item diberikan (untuk stok)
            if (this.item) {
                if (this.item.qty === 0) {
                    return 'Habis';
                } else if (this.item.qty < this.item.safety) {
                    return 'Stok Rendah';
                } else {
                    return 'Tersedia';
                }
            }

            return 'N/A';
        },

        /**
         * Get badge class berdasarkan status
         */
        badgeClass() {
            // Jika prop status langsung diberikan (untuk tracking)
            if (this.status) {
                return this.getTrackingBadgeClass(this.status);
            }

            // Jika item diberikan (untuk stok)
            if (this.item) {
                if (this.item.qty === 0) {
                    return 'bg-danger';
                } else if (this.item.qty < this.item.safety) {
                    return 'bg-warning text-dark';
                } else {
                    return 'bg-success';
                }
            }

            return 'bg-secondary';
        }
    },
    methods: {
        /**
         * Get badge class untuk status tracking
         */
        getTrackingBadgeClass(status) {
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
        }
    }
});
