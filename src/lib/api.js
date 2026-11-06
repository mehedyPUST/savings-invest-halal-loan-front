import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for common errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Optional: redirect to login if not already there
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/bootstrap')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  bootstrapManager: (data) => api.post('/auth/bootstrap-manager', data),
  register: (data) => api.post('/auth/register', data),
};

// Fund
export const fundAPI = {
  get: () => api.get('/fund'),
  history: () => api.get('/fund/history'),
  updateTargets: (data) => api.put('/fund/targets', data),
};

// Savings
export const savingsAPI = {
  list: (params) => api.get('/savings', { params }),
  createRequest: (data) => api.post('/savings/request', data),
  updateRequest: (id, data) => api.put(`/savings/request/${id}`, data),
  confirm: (id, fundPassword) => api.post(`/savings/confirm/${id}`, { fundPassword }),
  deny: (id, reason) => api.post(`/savings/deny/${id}`, { reason }),
};

// Loans
export const loansAPI = {
  list: (params) => api.get('/loans', { params }),
  get: (id) => api.get(`/loans/${id}`),
  apply: (data) => api.post('/loans/apply', data),
  startVoting: (id) => api.post(`/loans/${id}/start-voting`),
  vote: (id, vote) => api.post(`/loans/${id}/vote`, { vote }),
  finalize: (id) => api.post(`/loans/${id}/finalize`),
  reVote: (id) => api.post(`/loans/${id}/re-vote`),
  disburse: (id, data) => api.post(`/loans/${id}/disburse`, data),
  confirmReceipt: (id, data) => api.post(`/loans/${id}/confirm-receipt`, data),
  repay: (id, data) => api.post(`/loans/${id}/repay`, data),
};

// Users
export const usersAPI = {
  list: () => api.get('/users'),
  updateStatus: (id, isActive) => api.patch(`/users/${id}/status`, { isActive }),
};
