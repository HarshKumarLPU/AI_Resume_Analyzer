import axiosInstance from './axiosInstance';

export const authAPI = {
  login: (data) => axiosInstance.post('/auth/login', data),
  signup: (data) => axiosInstance.post('/auth/signup', data),
  getMe: () => axiosInstance.get('/auth/me'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
  changePassword: (data) => axiosInstance.put('/auth/change-password', data),
};

export const resumeAPI = {
  upload: (formData) => axiosInstance.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: () => axiosInstance.get('/resumes'),
  getById: (id) => axiosInstance.get(`/resumes/${id}`),
  delete: (id) => axiosInstance.delete(`/resumes/${id}`),
};

export const analysisAPI = {
  create: (resumeId) => axiosInstance.post(`/analysis/${resumeId}`),
  reanalyze: (resumeId) => axiosInstance.post(`/analysis/${resumeId}/reanalyze`),
  getById: (resumeId) => axiosInstance.get(`/analysis/${resumeId}`),
  getAll: () => axiosInstance.get('/analysis'),
  delete: (resumeId) => axiosInstance.delete(`/analysis/${resumeId}`),
  matchJD: (resumeId, jdText) => axiosInstance.post(`/analysis/${resumeId}/jd-match`, { jdText }),
  rewritePoint: (bulletPoint) => axiosInstance.post(`/analysis/rewrite`, { bulletPoint }),
  generateInterview: (resumeId) => axiosInstance.post(`/analysis/${resumeId}/mock-interview`),
  analyzeSkillGap: (resumeId, targetRole) => axiosInstance.post(`/analysis/${resumeId}/skill-gap`, { targetRole }),
};
