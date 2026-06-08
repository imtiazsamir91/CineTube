import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined in environment variables');
}

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    withCredentials: true, 
});


axiosInstance.interceptors.request.use(async (config) => {
  
    if (typeof window === 'undefined') {
        try {
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();
            
            
            const allCookies = cookieStore.toString();
            if (allCookies) {
                config.headers.Cookie = allCookies;
            }
        } catch (error) {
            console.error("Failed to set cookies in server-side request:", error);
        }
    }
    return config;
});

const httpClient = {
    get: async <T>(url: string, options?: any) => {
        const res = await axiosInstance.get<T>(url, options);
        return res.data;
    },
    post: async <T>(url: string, data?: any, options?: any) => {
        const res = await axiosInstance.post<T>(url, data, options);
        return res.data;
    },
    put: async <T>(url: string, data?: any, options?: any) => {
        const res = await axiosInstance.put<T>(url, data, options);
        return res.data;
    },
    patch: async <T>(url: string, data?: any, options?: any) => {
        const res = await axiosInstance.patch<T>(url, data, options);
        return res.data;
    },
    delete: async <T>(url: string, options?: any) => {
        const res = await axiosInstance.delete<T>(url, options);
        return res.data;
    },
};

export { httpClient };