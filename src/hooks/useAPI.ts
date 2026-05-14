import { useCallback } from 'react';

import { useAxios } from './useAxios';

interface IRequest {
    endpoint: string;
    params?: Record<string, unknown>;
    body?: unknown;
}

export const useAPI = <T>() => {
    const axiosInstance = useAxios();

    const get = useCallback(
        async ({ endpoint, params }: IRequest): Promise<T> => {
            const response = await axiosInstance.get<T>(endpoint, { params });
            return response.data;
        },
        [axiosInstance],
    );

    const post = useCallback(
        async ({ endpoint, body, params }: IRequest): Promise<T> => {
            const response = await axiosInstance.post<T>(endpoint, body, { params });
            return response.data;
        },
        [axiosInstance],
    );

    const patch = useCallback(
        async ({ endpoint, body, params }: IRequest): Promise<T> => {
            const response = await axiosInstance.patch<T>(endpoint, body, { params });
            return response.data;
        },
        [axiosInstance],
    );

    const remove = useCallback(
        async ({ endpoint, params }: IRequest): Promise<T> => {
            const response = await axiosInstance.delete<T>(endpoint, { params });
            return response.data;
        },
        [axiosInstance],
    );

    return { get, post, patch, remove };
};
