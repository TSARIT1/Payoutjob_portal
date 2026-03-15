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

export const StudentRegister = registerStudent;
export const StudentLogin = (data) => loginUser({ ...data, role: 'Student' });
export const OtpVerification = async () => ({ success: true });
export const loginStudent = StudentLogin;
export const verifyOtp = OtpVerification;

export default API;
