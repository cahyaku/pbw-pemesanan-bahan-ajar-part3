/**
 * dashboard-app.js - Vue App untuk Dashboard Page
 * Standalone Vue application tanpa dependency app.js
 */

document.addEventListener('DOMContentLoaded', function () {
    // Periksa apakah pengguna sudah login
    if (!isLoggedIn()) {
        window.location.href = '../index.html';
        return;
    }

    // Inisialisasi Vue App untuk Dashboard
    new Vue({
        el: '#app',
        data: {
            userName: 'User',
            timeGreeting: 'Selamat Datang',
            welcomeMessage: '',
            currentDateTime: '',
            showReportSubmenu: false,
            intervalId: null
        },
        computed: {
            // Computed property untuk greeting berdasarkan waktu
            greetingIcon() {
                const hour = new Date().getHours();
                if (hour >= 5 && hour < 11) return '🌅';
                else if (hour >= 11 && hour < 15) return '☀️';
                else if (hour >= 15 && hour < 18) return '🌤️';
                else return '🌙';
            }
        },
        watch: {
            // Watcher untuk mengupdate tampilan secara real-time
            currentDateTime(newVal) {
                // Update otomatis setiap detik
            }
        },
        methods: {
            /**
             * Memuat data dashboard dan informasi pengguna
             */
            loadDashboard() {
                const user = getCurrentUser();

                if (user) {
                    this.userName = user.nama;
                    this.welcomeMessage = `
                        Selamat datang, <strong>${user.nama}</strong>!<br>
                        ${user.role} - ${user.lokasi}
                    `;
                }
            },

            /**
             * Update greeting berdasarkan waktu
             */
            updateTimeGreeting() {
                const now = new Date();
                const hour = now.getHours();

                let greeting = '';
                let icon = '';

                // Tentukan salam berdasarkan waktu
                if (hour >= 5 && hour < 11) {
                    greeting = 'Selamat Pagi';
                    icon = '🌅';
                } else if (hour >= 11 && hour < 15) {
                    greeting = 'Selamat Siang';
                    icon = '☀️';
                } else if (hour >= 15 && hour < 18) {
                    greeting = 'Selamat Sore';
                    icon = '🌤️';
                } else {
                    greeting = 'Selamat Malam';
                    icon = '🌙';
                }

                this.timeGreeting = `${greeting} ${icon}`;

                // Update tanggal dan waktu
                const dateOptions = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                };

                const timeOptions = {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                };

                const dateString = now.toLocaleDateString('id-ID', dateOptions);
                const timeString = now.toLocaleTimeString('en-US', timeOptions);

                this.currentDateTime = `${dateString}, pukul ${timeString}`;
            },

            /**
             * Navigasi ke halaman lain
             */
            navigateTo(page) {
                switch (page) {
                    case 'info-bahan-ajar':
                        window.location.href = 'stok-table.html';
                        break;
                    case 'tracking':
                        window.location.href = 'do-tracking.html';
                        break;
                    case 'histori':
                        alert('Fitur Histori Transaksi belum tersedia');
                        break;
                    case 'monitoring-progress':
                        alert('Fitur Monitoring Progress DO Bahan Ajar belum tersedia');
                        break;
                    case 'rekap-bahan-ajar':
                        alert('Fitur Rekap Bahan Ajar belum tersedia');
                        break;
                    default:
                        alert('Halaman dalam pengembangan');
                }
            },

            /**
             * Toggle submenu laporan
             */
            toggleReportSubmenu() {
                this.showReportSubmenu = !this.showReportSubmenu;
            },

            /**
             * Logout user
             */
            logout() {
                sessionStorage.removeItem('currentUser');
                window.location.href = '../index.html';
            }
        },
        mounted() {
            // Load dashboard data
            this.loadDashboard();

            // Update time greeting
            this.updateTimeGreeting();

            // Set interval untuk update real-time
            this.intervalId = setInterval(() => {
                this.updateTimeGreeting();
            }, 1000);
        },
        beforeDestroy() {
            // Clear interval saat component di-destroy
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
        }
    });
});

// Utility functions untuk di-load dari index.js
function isLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}
