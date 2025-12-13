import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// Lost Person APIs
export const lostAPI = {
    create: (formData) => api.post('/lost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getAll: (params) => api.get('/lost', { params }),
    getOne: (id) => api.get(`/lost/${id}`),
    update: (id, data) => api.put(`/lost/${id}`, data),
    delete: (id) => api.delete(`/lost/${id}`),
};

// Found Person APIs
export const foundAPI = {
    create: (formData) => api.post('/found', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getAll: (params) => api.get('/found', { params }),
    getOne: (id) => api.get(`/found/${id}`),
    update: (id, data) => api.put(`/found/${id}`, data),
    delete: (id) => api.delete(`/found/${id}`),
};

// Admin APIs
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getUsers: () => api.get('/admin/users'),
    getReports: () => api.get('/admin/reports'),
    approveLost: (id) => api.put(`/admin/approve/lost/${id}`),
    rejectLost: (id) => api.put(`/admin/reject/lost/${id}`),
    approveFound: (id) => api.put(`/admin/approve/found/${id}`),
    rejectFound: (id) => api.put(`/admin/reject/found/${id}`),
    deleteReport: (type, id) => api.delete(`/admin/report/${type}/${id}`),
    deleteUser: (id) => api.delete(`/admin/user/${id}`),
};

// Match APIs
export const matchAPI = {
    runMatching: () => api.post('/match/run'),
    getResults: (params) => api.get('/match/results', { params }),
    getOne: (id) => api.get(`/match/${id}`),
    updateStatus: (id, data) => api.put(`/match/${id}`, data),
    delete: (id) => api.delete(`/match/${id}`),
};

export default api;
