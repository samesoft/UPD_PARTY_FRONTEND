import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
baseURL: 'https://upd-party-backend.samesoft.app/api',
//baseURL: 'http://localhost:3200/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;