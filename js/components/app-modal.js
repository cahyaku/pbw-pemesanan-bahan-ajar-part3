/**
 * app-modal.js - Vue Component untuk Modal Bootstrap
 * Custom element: <app-modal>
 * Template: Loaded from /templates/app-modal.html
 */

// Fetch template HTML dari file eksternal
fetch('../templates/app-modal.html')
    .then(response => response.text())
    .then(template => {
        // Registrasi komponen <app-modal> ke Vue
        Vue.component('app-modal', {
            template: template,
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
    })
    .catch(error => {
        console.error('Error loading app-modal template:', error);
    });

