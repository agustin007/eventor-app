const isProduction = window.location.hostname !== 'localhost';
export const API_CONFIG = {
    baseUrl: isProduction
        ? 'https://eventor-api-node.onrender.com/api'  // Node.js backend
        : 'http://localhost:10000/api',                 // Local Node.js
    endpoints: {
        events: '/events',
        auth: '/auth',
        tickets: '/tickets',
        users: '/users'
    }
};
