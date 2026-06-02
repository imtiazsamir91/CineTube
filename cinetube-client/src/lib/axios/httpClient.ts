import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined in environment variables');
}

// Axios ইনস্ট্যান্স তৈরি
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
});

// রিকোয়েস্ট ইন্টারসেপ্টর: সার্ভার এবং ক্লায়েন্ট ডিটেকশন
axiosInstance.interceptors.request.use(async (config) => {
    // ১. যদি ব্রাউজারে থাকি
    if (typeof window !== 'undefined') {
        const Cookies = (await import('js-cookie')).default;
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    } 
    // ২. যদি সার্ভারে থাকি (Server Components/Actions)
    else {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }
    return config;
});

// রিকোয়েস্ট মেথডসমূহ
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