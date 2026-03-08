import axios from "axios";
import config from "../config";

const API_URL = config.apiUrl;

export async function sendContactMessage({ name, email, subject, message }) {
  const response = await axios.post(`${API_URL}/contact`, { name, email, subject, message });
  return response.data;
}
