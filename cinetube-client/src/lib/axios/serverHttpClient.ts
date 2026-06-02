import axios from 'axios';
import { cookies } from 'next/headers';

// .env ফাইল থেকে URL নিশ্চিত করুন
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

console.log("DEBUG: API_BASE_URL in serverHttpClient:", API_BASE_URL); // এটি চেক করুন

const serverHttpClient = axios.create({
  baseURL: API_BASE_URL, 
  timeout: 30000,
});

serverHttpClient.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

export { serverHttpClient };