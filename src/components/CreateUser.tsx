import React, { useState, useEffect } from 'react';
import { X, DollarSign, Phone, User as UserIcon, Shield } from 'lucide-react';

type UserStatus = "Pending" | "Selected" | "Rejected";
type UserRole = "admin" | "user";

interface CreateUserProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    name: string;
    phoneNo: number;
    chitNo: number;
    amount: number;
    status: UserStatus;
    roles: UserRole;
  }) => void;
  editUser?: {
    _id: string;
    name: string;
    phoneNo: number;
    chitNo: number;
    amount: number;
    status: UserStatus;
    roles?: UserRole;
  };
}

const CreateUser: React.FC<CreateUserProps> = ({ isOpen, onClose, onSubmit, editUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNo: '',
    chitNo: '1',
    amount: '0',
    status: 'Pending' as UserStatus,
    roles: 'user' as UserRole
  });

  // Populate form when editUser changes
  useEffect(() => {
    if (editUser) {
      setFormData({
        name: editUser.name,
        phoneNo: editUser.phoneNo.toString(),
        chitNo: editUser.chitNo.toString(),
        amount: editUser.amount.toString(),
        status: editUser.status,
        roles: editUser.roles || 'user'
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        phoneNo: '',
        amount: '0',
        chitNo: '1',
        status: 'Pending',
        roles: 'user'
      });
    }
  }, [editUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phoneNo || !formData.chitNo || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit({
      name: formData.name,
      phoneNo: parseInt(formData.phoneNo),
      chitNo: parseInt(formData.chitNo),
      amount: parseFloat(formData.amount),
      status: formData.status,
      roles: formData.roles
    });

    // Reset form only if not in edit mode
    if (!editUser) {
      setFormData({
        name: '',
        phoneNo: '',
        chitNo: '',
        amount: '',
        status: 'Pending',
        roles: 'user'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 bg-opacity-50 transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Slide-in panel */}
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editUser ? 'Edit User' : 'Create New User'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter user name"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              {/* Chit Number */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Chit Number *
                </label>
                <input
                  type="number"
                  name="chitNo"
                  value={formData.chitNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter chit number"
                  onWheel={(e) => e.currentTarget.blur()}
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Pending">Pending</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Role
                </label>
                <select
                  name="roles"
                  value={formData.roles}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
