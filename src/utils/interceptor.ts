import axios from "axios";

const setAccessToken = (config: any) => {
  if (!config.headers) {
    config.headers = {};
  }

  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
};

const api = axios.create();

api.interceptors.request.use(
  (config) => setAccessToken(config),
  (error) => Promise.reject(error)
);

export { api };
