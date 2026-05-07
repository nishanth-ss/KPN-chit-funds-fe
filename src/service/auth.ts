import API from '../api/axios';

interface LoginCredentials {
  phoneNo: number;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: {
    _id: string;
    name: string;
    phoneNo: number;
    amount: number;
    status: string;
    roles: string;
  };
}

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
}

// Login user
export const login = async (credentials: LoginCredentials): Promise<{ success: boolean; data?: LoginResponse; message?: string }> => {
  try {
    const response = await API.post('/auth/signin', credentials);
    return { 
      success: true, 
      data: response.data 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed' 
    };
  }
};

// Get current user from localStorage
export const getCurrentUser = (): AuthState => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  return {
    token,
    user: user ? JSON.parse(user) : null,
    isAuthenticated: !!token && !!user
  };
};

// Set authentication data
export const setAuthData = (token: string, user: any) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get token for API calls
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};
