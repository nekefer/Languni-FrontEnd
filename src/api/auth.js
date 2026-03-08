import axios from "axios";
import config from "../config";

const API_URL = config.apiUrl;

// Configure axios to send cookies automatically
axios.defaults.withCredentials = true;

export const registerUser = async (form) => {
  const response = await axios.post(`${API_URL}/auth/`, form);
  return response.data;
};

// Update loginUser to use form-urlencoded as required by OAuth2PasswordRequestForm
export const loginUser = async (email, password) => {
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", password);
  const response = await axios.post(`${API_URL}/auth/token`, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
};

// 🎯 Unified Google OAuth - automatically handles registration and login
export const googleLogin = () => {
  window.location.href = `${API_URL}/auth/google/login`;
};

export const googleRegister = () => {
  window.location.href = `${API_URL}/auth/google/login`;
};

// ✅ Updated to use cookies instead of localStorage
export const fetchUserInfo = async () => {
  const response = await axios.get(`${API_URL}/auth/me`);
  return response.data;
};

// ✅ Add logout function
export const logoutUser = async () => {
  const response = await axios.post(`${API_URL}/auth/logout`);
  return response.data;
};

// ✅ Add refresh token function
export const refreshToken = async () => {
  const response = await axios.post(`${API_URL}/auth/refresh`);
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await axios.get(`${API_URL}/auth/verify-email`, { params: { token } });
  return response.data;
};

export const resendVerification = async (email) => {
  const response = await axios.post(`${API_URL}/auth/resend-verification`, { email });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (token, new_password, new_password_confirm) => {
  const response = await axios.post(`${API_URL}/auth/reset-password`, {
    token,
    new_password,
    new_password_confirm,
  });
  return response.data;
};
