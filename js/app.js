/**
 * app.js - Inisialisasi Vue Root Instance
 * Main application entry point untuk SITTA
 */

// Global utility functions
function isLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

// Initialize Vue root instance when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Check login for protected pages
    const protectedPages = ['dashboard.html', 'stok-table.html', 'do-tracking.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !isLoggedIn()) {
        window.location.href = '../index.html';
        return;
    }

    // Only initialize if #app element exists and is not already initialized
    if (document.getElementById('app') && !window.vueApp) {
        window.vueApp = new Vue({
            el: '#app',
            data: {
                // Global app state
                userName: 'User',
                currentUser: null,
                isAuthenticated: false
            },
            methods: {
                // Global methods
                checkAuth() {
                    const user = getCurrentUser();
                    if (user) {
                        this.currentUser = user;
                        this.userName = user.nama || 'User';
                        this.isAuthenticated = true;
                    } else {
                        this.isAuthenticated = false;
                    }
                },

                logout() {
                    logout();
                }
            },
            mounted() {
                this.checkAuth();
            }
        });
    }
});
