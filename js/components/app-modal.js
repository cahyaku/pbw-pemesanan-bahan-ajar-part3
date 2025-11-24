/**
 * app-modal.js - Vue Component untuk Modal Bootstrap
 * Custom element: <app-modal>
 * Template ID: tpl-modal
 */

Vue.component('app-modal', {
    template: `
        <div class="modal fade" 
             :id="modalId" 
             tabindex="-1" 
             :aria-labelledby="modalId + 'Label'"
             aria-hidden="true">
            <div class="modal-dialog" :class="dialogClass">
                <div class="modal-content">
                    <div class="modal-header" :class="headerClass">
                        <h5 class="modal-title" :id="modalId + 'Label'">
                            <i v-if="icon" :class="icon + ' me-2'"></i>
                            {{ title }}
                        </h5>
                        <button type="button" 
                                :class="closeButtonClass" 
                                data-bs-dismiss="modal" 
                                aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                    <div v-if="showFooter" class="modal-footer">
                        <slot name="footer">
                            <button type="button" 
                                    class="btn btn-secondary" 
                                    data-bs-dismiss="modal"
                                    @click="handleCancel">
                                <i class="bi bi-x-circle me-2"></i>{{ cancelText }}
                            </button>
                            <button type="button" 
                                    class="btn" 
                                    :class="confirmButtonClass"
                                    @click="handleConfirm">
                                <i class="bi bi-check-circle me-2"></i>{{ confirmText }}
                            </button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: {
        modalId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: 'md', // sm, md, lg, xl
            validator: value => ['sm', 'md', 'lg', 'xl'].includes(value)
        },
        centered: {
            type: Boolean,
            default: true
        },
        headerVariant: {
            type: String,
            default: 'primary' // primary, secondary, success, danger, warning, info
        },
        showFooter: {
            type: Boolean,
            default: true
        },
        confirmText: {
            type: String,
            default: 'Simpan'
        },
        cancelText: {
            type: String,
            default: 'Batal'
        },
        confirmVariant: {
            type: String,
            default: 'primary'
        }
    },
    computed: {
        dialogClass() {
            let classes = [];

            if (this.size !== 'md') {
                classes.push(`modal-${this.size}`);
            }

            if (this.centered) {
                classes.push('modal-dialog-centered');
            }

            return classes.join(' ');
        },

        headerClass() {
            return `bg-${this.headerVariant} text-white`;
        },

        closeButtonClass() {
            return this.headerVariant === 'light' || this.headerVariant === 'warning'
                ? 'btn-close'
                : 'btn-close btn-close-white';
        },

        confirmButtonClass() {
            return `btn-${this.confirmVariant}`;
        }
    },
    methods: {
        handleConfirm() {
            this.$emit('confirm');
        },

        handleCancel() {
            this.$emit('cancel');
        },

        show() {
            const modalEl = document.getElementById(this.modalId);
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        },

        hide() {
            const modalEl = document.getElementById(this.modalId);
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) {
                modal.hide();
            }
        }
    },
    mounted() {
        // Expose show/hide methods ke parent melalui ref
        if (this.$parent) {
            this.$parent.$refs[this.modalId] = this;
        }
    }
});
