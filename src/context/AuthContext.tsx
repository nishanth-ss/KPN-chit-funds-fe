import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { getCurrentUser, setAuthData, clearAuthData } from '../service/auth';

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, user: any) => void;
  logout: () => void;
  updateUser: (user: any) => void;
}

type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: any } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = getCurrentUser();

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check authentication on app load
    const authData = getCurrentUser();
    if (authData.isAuthenticated) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: authData.token!,
          user: authData.user!
        }
      });
    }
  }, []);

  const login = (token: string, user: any) => {
    setAuthData(token, user);
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { token, user }
    });
  };

  const logout = () => {
    clearAuthData();
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user: any) => {
    const currentAuth = getCurrentUser();
    if (currentAuth.token) {
      setAuthData(currentAuth.token, user);
    }
    dispatch({
      type: 'UPDATE_USER',
      payload: user
    });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
