// Global Axios configuration for HTTP requests
import axios from 'axios';
window.axios = axios;

// Identify AJAX requests for Laravel middleware/CSRF handling
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
