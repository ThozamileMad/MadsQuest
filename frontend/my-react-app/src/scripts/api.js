import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // your Flask backend
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export async function post(url, data) {
  try {
    const res = await API.post(url, data);
    return res;
  } catch (err) {
    return false;
  }
}

export async function get(url) {
  try {
    const res = await API.get(url, {
      headers: { "Cache-Control": "no-cache" },
    });
    return res;
  } catch (err) {
    return false;
  }
}

export default API;
