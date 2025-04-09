// API service for communicating with the backend
const API_URL = 'http://localhost:5000/api';

// Interface for API response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
  user?: any;
  count?: number;
  pagination?: any;
  event?: any;
}

// Auth API
export const authApi = {
  register: async (userData: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials: { username: string; password: string }): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getCurrentUser: async (): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, message: 'No token found' };

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// Events API
export const eventsApi = {
  getAllEvents: async (params = {}): Promise<ApiResponse<any>> => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const url = queryString ? `${API_URL}/events?${queryString}` : `${API_URL}/events`;
    
    const response = await fetch(url);
    return response.json();
  },

  getEvent: async (id: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/events/${id}`);
    return response.json();
  },

  createEvent: async (eventData: FormData): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, message: 'Authentication required' };

    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: eventData, // FormData for file upload
    });
    return response.json();
  },

  updateEvent: async (id: string, eventData: FormData): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, message: 'Authentication required' };

    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: eventData, // FormData for file upload
    });
    return response.json();
  },

  deleteEvent: async (id: string): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, message: 'Authentication required' };

    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
}; 