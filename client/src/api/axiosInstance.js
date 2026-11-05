import axios from "axios";
import { networkTracker, labelFor } from "../utils/networkTracker";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.__label = labelFor(config.url);
    networkTracker.start(config.__label);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config?.__label)
      networkTracker.finish(response.config.__label, true);
    return response;
  },
  (error) => {
    if (error.config?.__label)
      networkTracker.finish(error.config.__label, false);

    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");

      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  },
);

const inflight = new Map();
const rawGet = axiosInstance.get.bind(axiosInstance);
axiosInstance.get = (url, config) => {
  const key = `${url}|${JSON.stringify(config?.params ?? {})}`;
  if (inflight.has(key)) return inflight.get(key);
  const request = rawGet(url, config).finally(() => inflight.delete(key));
  inflight.set(key, request);
  return request;
};

export default axiosInstance;
