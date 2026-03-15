import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const STORAGE_KEYS = {
  token: 'authToken',
  role: 'authRole',
  user: 'userProfile'
};

const API = axios.create({
  baseURL: API_BASE_URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function storeAuthSession({ token, user }) {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.token, token);
  }
  if (user) {
    localStorage.setItem(STORAGE_KEYS.role, user.role);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  }
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.role);
  localStorage.removeItem(STORAGE_KEYS.user);
}

export function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem(STORAGE_KEYS.token);
}

export async function loginUser(payload) {
  const response = await API.post('/auth/login', payload);
  return response.data;
}

export async function registerStudent(payload) {
  const response = await API.post('/auth/register', { ...payload, role: 'Student' });
  return response.data;
}

export async function registerEmployer(payload) {
  const response = await API.post('/auth/register', { ...payload, role: 'Employer' });
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await API.get('/auth/me');
  return response.data;
}

export async function updateUserProfile(payload) {
  const response = await API.put('/auth/profile', payload);
  return response.data;
}

export async function fetchJobs() {
  const response = await API.get('/jobs');
  return response.data;
}

export async function applyToJob(jobId, payload) {
  const response = await API.post(`/jobs/${jobId}/apply`, payload);
  return response.data;
}

export async function fetchMyApplications() {
  const response = await API.get('/applications/me');
  return response.data;
}

export async function fetchEmployerDashboard() {
  const response = await API.get('/employer/dashboard');
  return response.data;
}

export async function createEmployerJob(payload) {
  const response = await API.post('/employer/jobs', payload);
  return response.data;
}

export async function updateEmployerJob(jobId, payload) {
  const response = await API.put(`/employer/jobs/${jobId}`, payload);
  return response.data;
}

export async function deleteEmployerJob(jobId) {
  const response = await API.delete(`/employer/jobs/${jobId}`);
  return response.data;
}

export async function updateEmployerApplication(applicationId, payload) {
  const response = await API.patch(`/employer/applications/${applicationId}`, payload);
  return response.data;
}

export async function fetchEmployerEmailHistory() {
  const response = await API.get('/employer/email-history');
  return response.data;
}

export async function sendEmployerEmail(payload) {
  const response = await API.post('/employer/send-email', payload);
  return response.data;
}

export async function generateAiJobPosting(payload) {
  const response = await API.post('/ai/job-posting', payload);
  return response.data;
}

export async function screenAiApplication(payload) {
  const response = await API.post('/ai/screen-application', payload);
  return response.data;
}

export async function enhanceAiCv(payload) {
  const response = await API.post('/ai/cv-enhance', payload);
  return response.data;
}

export async function autofillAiApplication(payload) {
  const response = await API.post('/ai/autofill-application', payload);
  return response.data;
}

export async function tailorAiResume(payload) {
  const response = await API.post('/ai/tailor-resume', payload);
  return response.data;
}

export async function getAiReferralInsights(payload) {
  const response = await API.post('/ai/referral-insights', payload);
  return response.data;
}

  // ── Saved Jobs ──────────────────────────────────────────────────────────────
  export async function fetchSavedJobs() {
    const response = await API.get('/jobs/saved');
    return response.data;
  }

  export async function saveJob(jobId) {
    const response = await API.post(`/jobs/${jobId}/save`);
    return response.data;
  }

  export async function unsaveJob(jobId) {
    const response = await API.delete(`/jobs/${jobId}/save`);
    return response.data;
  }

  // ── Job Alerts ───────────────────────────────────────────────────────────────
  export async function fetchJobAlerts() {
    const response = await API.get('/job-alerts');
    return response.data;
  }

  export async function createJobAlert(payload) {
    const response = await API.post('/job-alerts', payload);
    return response.data;
  }

  export async function deleteJobAlert(alertId) {
    const response = await API.delete(`/job-alerts/${alertId}`);
    return response.data;
  }

  // ── Recommended Jobs ─────────────────────────────────────────────────────────
  export async function fetchRecommendedJobs() {
    const response = await API.get('/jobs/recommended');
    return response.data;
  }

  // ── Blog Posts ───────────────────────────────────────────────────────────────
  export async function fetchBlogPosts() {
    const response = await API.get('/blog-posts');
    return response.data;
  }

  export async function createBlogPost(payload) {
    const response = await API.post('/blog-posts', payload);
    return response.data;
  }

  // ── Notifications ────────────────────────────────────────────────────────────
  export async function fetchNotifications() {
    const response = await API.get('/notifications');
    return response.data;
  }

  export async function markNotificationRead(notifId) {
    const response = await API.patch(`/notifications/${notifId}/read`);
    return response.data;
  }

  export async function markAllNotificationsRead() {
    const response = await API.patch('/notifications/read-all');
    return response.data;
  }

  // ── Employer: Candidate Search ───────────────────────────────────────────────
  export async function fetchEmployerCandidates(params = {}) {
    const response = await API.get('/employer/candidates', { params });
    return response.data;
  }

  export async function fetchStudentTracker() {
    const response = await API.get('/tracker/student');
    return response.data;
  }

  export async function fetchEmployerTracker() {
    const response = await API.get('/tracker/employer');
    return response.data;
  }

  export async function fetchAdminDashboard() {
    const response = await API.get('/admin/dashboard');
    return response.data;
  }

  export async function fetchAdminEmployers() {
    const response = await API.get('/admin/employers');
    return response.data;
  }

  export async function approveEmployer(employerId, payload = {}) {
    const response = await API.patch(`/admin/employers/${employerId}/approve`, payload);
    return response.data;
  }

  export async function rejectEmployer(employerId, payload = {}) {
    const response = await API.patch(`/admin/employers/${employerId}/reject`, payload);
    return response.data;
  }

  export async function fetchAdminContactMessages() {
    const response = await API.get('/admin/contact-messages');
    return response.data;
  }

  export async function submitContactMessage(payload) {
    const response = await API.post('/contact-us', payload);
    return response.data;
  }

export const StudentRegister = registerStudent;
export const StudentLogin = (data) => loginUser({ ...data, role: 'Student' });
export const OtpVerification = async () => ({ success: true });
export const loginStudent = StudentLogin;
export const verifyOtp = OtpVerification;

export default API;
