import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  username: string;
  fullName?: string;
  role: 'member' | 'admin';
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

// Helper function to set auth data after login/register
export const setAuthData = (data: AuthResponse): boolean => {
  if (data.success) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return true;
  }
  return false;
};

// Get the current authenticated user
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  
  try {
    return JSON.parse(user) as User;
  } catch (error) {
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token') && !!getCurrentUser();
};

// Check if current user has admin role
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return !!user && user.role === 'admin';
};

// Logout the user
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Function to make authenticated API requests
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<any> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    toast({
      title: "Authentication Error",
      description: "You are not logged in. Please log in to continue.",
      variant: "destructive",
    });
    return null;
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (response.status === 401) {
      // Token expired or invalid
      logout();
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });
      window.location.href = '/login';
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    toast({
      title: "Request Failed",
      description: "Failed to communicate with the server.",
      variant: "destructive",
    });
    return null;
  }
}; 