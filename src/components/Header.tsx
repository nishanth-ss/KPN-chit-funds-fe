import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC<{ title: string; showHomeButton?: boolean }> = ({ 
  title, 
  showHomeButton = false 
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleUsers = () => {
    navigate('/users');
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          
          {/* Left Section - Title and Navigation */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            {showHomeButton && (
              <button
                onClick={handleHome}
                className="flex items-center px-2 py-1 sm:px-3 sm:py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}
            
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              {title}
            </h1>
          </div>

          {/* Right Section - User Info and Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* User Info */}
            <div className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.roles}</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            {user?.roles === 'admin' && (
              <button
                onClick={handleUsers}
                className="flex items-center px-2 py-1 sm:px-3 sm:py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Users</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-2 py-1 sm:px-3 sm:py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
