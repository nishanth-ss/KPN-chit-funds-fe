// src/components/cards/UserCard.tsx

import React, { useState } from "react";
import {
  Edit,
  Trash2,
  Eye,
  Phone,
  IndianRupee,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import UserHistoryModal from "./UserHistoryModal";
import { getUserWithHistory } from "../service/users";

type UserStatus = "Pending" | "Selected" | "Rejected";
type UserRole = "admin" | "user";

interface User {
  activeCycleId?: string;
  _id: string;
  name: string;
  phoneNo: number;
  chitNo: number;
  amount: number;
  status: UserStatus;
  roles?: UserRole;
  createdAt: string;
}

interface UserCardProps {
  user: User;
  currentUser?: User;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
  onView?: (user: User) => void;
}

const statusStyles: Record<UserStatus, string> = {
  Pending:
    "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Selected:
    "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Rejected:
    "bg-red-100 text-red-700 border border-red-200",
};

const roleStyles: Record<UserRole, string> = {
  admin:
    "bg-violet-100 text-violet-700 border border-violet-200",
  user:
    "bg-sky-100 text-sky-700 border border-sky-200",
};

const UserCard: React.FC<UserCardProps> = ({
  user,
  currentUser,
  onEdit,
  onDelete,
  onView,
}) => {
  // Check if current user is admin
  const isAdmin = currentUser?.roles === 'admin';
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [userHistory, setUserHistory] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const handleViewHistory = async () => {
    setLoadingHistory(true);
    try {
      const result = await getUserWithHistory(user._id);
      
      if (result.success) {
        setUserHistory(result.data.user);
        setShowHistoryModal(true);
      } else {
        alert(result.message || 'Failed to fetch user history');
      }
    } catch (error) {
      console.error('Error fetching user history:', error);
      alert('Error fetching user history');
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <>
      <div 
        className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-200 shadow-md hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2"
      >
        
        {/* Top Gradient */}
        <div className="h-1 sm:h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Background Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-indigo-50 via-transparent to-pink-50 pointer-events-none" />

        <div className="relative p-4 sm:p-6">

          {/* Header */}
          <div className="flex items-start justify-between">
            
            {/* Avatar + Info */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg sm:text-2xl font-bold shadow-lg flex-shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                  {user.name}
                </h2>

                <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm mt-1">
                  <Phone size={12} className="sm:size={14}" />
                  <span className="hidden sm:inline">+91 </span>
                  {user.phoneNo}
                </div>
                
                <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm mt-1">
                  <span className="font-medium">Chit No:</span>
                  {user.chitNo}
                </div>
                {user.activeCycleId && (
                <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm mt-1">
                  <span className="font-medium">Cycle ID:</span>
                  {user.activeCycleId}
                </div>
                )}
              </div>
            </div>

            {/* Role */}
            {user.roles && (
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  roleStyles[user.roles]
                }`}
              >
                <ShieldCheck size={14} />
                {user.roles}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-5 border-t border-dashed border-gray-200" />

          {/* Amount Section */}
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm mb-1">
                Total Amount
              </p>

              <div className="flex items-center text-2xl sm:text-3xl font-extrabold text-gray-900">
                <IndianRupee size={20} className="sm:size={28}" />
                {user.amount}
              </div>
            </div>

            {/* Status */}
            <span
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                statusStyles[user.status]
              }`}
            >
              {user.status}
            </span>
          </div>

          {/* Joined Date */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            <CalendarDays size={12} className="sm:size={16}" />
            <span className="hidden sm:inline">Joined on </span>
            {new Date(user.createdAt).toLocaleDateString()}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">

            {onView && (
              <button
                onClick={handleViewHistory}
                disabled={loadingHistory}
                className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 active:scale-95 transition-all text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingHistory ? (
                  <div className="animate-spin w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Eye size={14} className="sm:size={18}" />
                    <span className="hidden sm:inline">View</span>
                  </>
                )}
              </button>
            )}

            {onEdit && isAdmin && (
              <button
                onClick={() => onEdit(user)}
                className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 active:scale-95 transition-all text-xs sm:text-sm"
              >
                <Edit size={14} className="sm:size={18}" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}

            {onDelete && isAdmin && (
              <button
                onClick={() => onDelete(user._id)}
                className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 active:scale-95 transition-all text-xs sm:text-sm"
              >
                <Trash2 size={14} className="sm:size={18}" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User History Modal - Rendered outside card */}
      {showHistoryModal && userHistory && (
        <UserHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          user={userHistory}
        />
      )}
    </>
  );
};

export default UserCard;