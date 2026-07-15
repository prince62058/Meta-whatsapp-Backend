import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:9898/api'; // Change to real server URL

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {'Content-Type': 'application/json'},
});

// Attach JWT token to every request
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      // Navigation to login handled by auth context
    }
    return Promise.reject(error);
  },
);

// ── Auth ──────────────────────────────────────────────────
export const authAPI = {
  login: data => api.post('/auth/login', data),
  register: data => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// ── WhatsApp ──────────────────────────────────────────────
export const whatsappAPI = {
  getAccount: () => api.get('/whatsapp/account'),
  connect: data => api.post('/whatsapp/connect', data),
  disconnect: () => api.post('/whatsapp/disconnect'),
  getDashboardStats: () => api.get('/whatsapp/dashboard/stats'),

  // Campaigns
  getCampaigns: params => api.get('/whatsapp/campaigns', {params}),
  createCampaign: data => api.post('/whatsapp/campaigns', data),
  getCampaignReport: id => api.get(`/whatsapp/campaigns/${id}/report`),
  pauseCampaign: id => api.post(`/whatsapp/campaigns/${id}/pause`),
  resumeCampaign: id => api.post(`/whatsapp/campaigns/${id}/resume`),
  deleteCampaign: id => api.delete(`/whatsapp/campaigns/${id}`),

  // Templates
  getTemplates: params => api.get('/whatsapp/templates', {params}),
  createTemplate: data => api.post('/whatsapp/templates', data),
  syncTemplates: () => api.post('/whatsapp/templates/sync'),
  generateTemplateAI: prompt => api.post('/whatsapp/templates/ai-generate', {prompt}),

  // Contacts
  getContacts: params => api.get('/whatsapp/contacts', {params}),
  importContacts: formData =>
    api.post('/whatsapp/contacts/import', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    }),

  // Wallet
  getWallet: () => api.get('/whatsapp/wallet'),
  getTransactions: params => api.get('/whatsapp/wallet/transactions', {params}),
  addMoney: data => api.post('/whatsapp/wallet/add-money', data),

  // Plans
  getPlans: () => api.get('/whatsapp/plans'),
  buyPlan: id => api.post(`/whatsapp/plans/${id}/buy`),

  // Support
  getTickets: () => api.get('/whatsapp/support/tickets'),
  createTicket: data => api.post('/whatsapp/support/tickets', data),
  replyTicket: (id, data) => api.post(`/whatsapp/support/tickets/${id}/reply`, data),

  // Chat
  getConversations: () => api.get('/whatsapp/chat/conversations'),
  getMessages: conversationId =>
    api.get(`/whatsapp/chat/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, data) =>
    api.post(`/whatsapp/chat/conversations/${conversationId}/messages`, data),

  // Notifications
  getNotifications: () => api.get('/whatsapp/notifications'),
};

// ── Meta Ads ──────────────────────────────────────────────
export const adsAPI = {
  getAds: params => api.get('/ads', {params}),
  getAdDetails: id => api.get(`/ads/${id}`),
  createAd: data => api.post('/ads', data),
  restartAd: (id, data) => api.post(`/ads/${id}/restart`, data),

  getPlans: () => api.get('/ads/plans'),
  getInterests: query => api.get('/ads/interests', {params: {q: query}}),
  getLocations: query => api.get('/ads/locations', {params: {q: query}}),

  linkFacebook: data => api.post('/ads/facebook/link', data),
  getFacebookPages: () => api.get('/ads/facebook/pages'),
};

export default api;
