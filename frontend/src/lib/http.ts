
import axios from 'axios';

type RequestData = Record<string, string | number>;

// Use relative path in development, absolute in production
const BASE_URL = import.meta.env.DEV 
  ? '/backend'  // This will use Vite proxy
  : 'http://localhost:3001';

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important for CORS with credentials
  timeout: 10000,
});

// Enhanced error handling
export async function post(endpoint: string, data: RequestData | FormData) {
  try {
    // Remove Content-Type header for FormData, let browser set it
    const config = data instanceof FormData 
      ? { }
      : { headers: { 'Content-Type': 'application/json' } };

    const response = await http.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error("HTTP POST Error:", error);
    throw error
  }
}

export async function get(endpoint: string, params?: Record<string, string | number>) {
  try {
    console.log("Making request to:", `${http.defaults.baseURL}${endpoint}`)
    const response = await http.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error("HTTP GET Error:", error);
    throw error;
  }
}