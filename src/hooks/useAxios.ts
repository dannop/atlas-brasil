import axios, { type AxiosInstance } from 'axios';

const baseURL = import.meta.env.VITE_APP_API_URL ?? '';

let cached: AxiosInstance | null = null;

export const getAxios = (): AxiosInstance => {
    if (cached) return cached;

    cached = axios.create({
        baseURL,
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' },
    });

    cached.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // futuro: limpar sessão e redirecionar
            }
            return Promise.reject(error);
        },
    );

    return cached;
};

export const useAxios = () => getAxios();
