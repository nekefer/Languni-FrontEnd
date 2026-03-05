import axios from "axios";
import config from "../config";

const API_URL = config.apiUrl;

axios.defaults.withCredentials = true;

export async function updateProfile({ first_name, last_name }) {
  const response = await axios.patch(`${API_URL}/api/user/profile`, { first_name, last_name });
  return response.data;
}

export async function changePassword({ current_password, new_password, new_password_confirm }) {
  await axios.post(`${API_URL}/api/user/change-password`, {
    current_password,
    new_password,
    new_password_confirm,
  });
}

export async function deleteAccount() {
  await axios.delete(`${API_URL}/api/user`);
}
