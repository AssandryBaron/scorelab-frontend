import axios from 'axios';

// Creamos una instancia reutilizable de axios
const api = axios.create({
  // La URL base de tu Backend en Spring Boot
  baseURL: 'http://localhost:8080/api', 
});

// Este interceptor es el "filtro" del Frontend.
// Antes de CADA petición, revisa si hay un Token en el navegador
// y lo pega automáticamente en el Header 'Authorization'.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;