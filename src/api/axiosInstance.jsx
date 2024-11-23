// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://api.ssoenter.store',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        console.log('Sending request to:', config.url);
        console.log('With token:', token);
        console.log('Headers:', config.headers); // 추가
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('API 응답 성공:', response.config.url);
        return response.data;
    },
    (error) => {
        console.error('API 에러 발생:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message || error.message
        });

        if (error.response?.status === 401) {
            console.log('401 에러 발생, 현재 토큰:', localStorage.getItem('accessToken'));
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// default export 추가
export default axiosInstance;