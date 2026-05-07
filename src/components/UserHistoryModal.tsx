import React from 'react';
import { X, CalendarDays, IndianRupee, User, History, Award } from 'lucide-react';

interface AmountHistoryItem {
  amount: number;
  updatedAt: string;
  updatedBy: {
    _id: string;
    name: string;
  };
  _id: string;
}

interface SelectionHistoryItem {
  selectedAt: string;
  selectedBy: {
    _id: string;
    name: string;
  };
  selectionRound: number;
  _id: string;
}

interface UserHistoryData {
  _id: string;
  name: string;
  phoneNo: number;
  chitNo: number;
  amount: number;
  status: string;
  roles: string;
  createdAt: string;
  lastAmountUpdate?: string;
  lastSelectionDate?: string;
  totalSelections: number;
  amountHistory: AmountHistoryItem[];
  selectionHistory: SelectionHistoryItem[];
}

interface UserHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserHistoryData;
}

const UserHistoryModal: React.FC<UserHistoryModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">User History Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* User Basic Info */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-semibold text-gray-900">+91 {user.phoneNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Chit No</p>
                <p className="font-semibold text-gray-900">{user.chitNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <p className="font-semibold text-gray-900 capitalize">{user.roles}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Amount</p>
                <p className="font-semibold text-gray-900 flex items-center">
                  <IndianRupee className="w-4 h-4 mr-1" />
                  {user.amount}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  user.status === 'Selected' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : user.status === 'Rejected'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                }`}>
                  {user.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Selections</p>
                <p className="font-semibold text-gray-900 flex items-center">
                  <Award className="w-4 h-4 mr-1 text-purple-600" />
                  {user.totalSelections}
                </p>
              </div>
            </div>
          </div>

          {/* Key Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <CalendarDays className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-900">Last Amount Update</h3>
              </div>
              <p className="text-gray-700">
                {user.lastAmountUpdate ? formatDate(user.lastAmountUpdate) : 'Never updated'}
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Award className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-900">Last Selection</h3>
              </div>
              <p className="text-gray-700">
                {user.lastSelectionDate ? formatDate(user.lastSelectionDate) : 'Never selected'}
              </p>
            </div>
          </div>

          {/* Amount History */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <History className="w-5 h-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Amount Update History</h3>
            </div>
            
            {user.amountHistory.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated By</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {user.amountHistory.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="font-medium text-gray-900 flex items-center">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {item.amount}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1 text-gray-400" />
                              <span className="text-gray-700">{item.updatedBy.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.updatedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                <History className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No amount update history available</p>
              </div>
            )}
          </div>

          {/* Selection History */}
          <div>
            <div className="flex items-center mb-4">
              <Award className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Selection History</h3>
            </div>
            
            {user.selectionHistory.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Round</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selected By</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selected At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {user.selectionHistory.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Round {item.selectionRound}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1 text-gray-400" />
                              <span className="text-gray-700">{item.selectedBy.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.selectedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                <Award className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No selection history available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHistoryModal;
