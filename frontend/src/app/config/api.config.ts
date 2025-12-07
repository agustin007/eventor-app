const isProduction = window.location.hostname !== 'localhost';
export const API_CONFIG = {
    baseUrl: isProduction
        ? 'https://eventor-api.m7qu.onrender.com/api'
        : 'http://localhost:5299/api',
    endpoints: {
        events: '/events',
        auth: '/auth',
        tickets: '/tickets',
        users: '/users'
    }
};
