// API service for communicating with the backend
const API_URL = 'http://localhost:3000/api';

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

// Members API
export const membersApi = {
  // Get all members
  getMembers: async (params = {}): Promise<ApiResponse<any>> => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const url = queryString ? `${API_URL}/members?${queryString}` : `${API_URL}/members`;
    
    const response = await fetch(url);
    return response.json();
  },

  // Get a single member by ID
  getMember: async (id: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/members/${id}`);
    return response.json();
  },

  // Create a new member
  createMember: async (memberData: FormData): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, message: 'Authentication required' };

    const response = await fetch(`${API_URL}/members`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: memberData, // FormData for file upload
    });
    return response.json();
  },

  // Update an existing member
  updateMember: async (id: string, memberData: FormData): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, message: 'Authentication required' };

    const response = await fetch(`${API_URL}/members/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: memberData, // FormData for file upload
    });
    return response.json();
  },

  // Delete a member
  deleteMember: async (id: string): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, message: 'Authentication required' };

    const response = await fetch(`${API_URL}/members/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};