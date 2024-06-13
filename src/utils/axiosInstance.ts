import axios from 'axios';

// Establecer la URL base según tu entorno de desarrollo o producción
const BASE_URL = 'http://localhost:8000'; // Ajusta esto según sea necesario

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // O obtén el token del estado de Redux
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
