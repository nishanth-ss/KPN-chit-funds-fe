import { useEffect, useState } from "react";
import { getUsers, CreateUsers, updateUser, deleteUser } from "../service/users";
import UserCard from "../components/UserCard";
import CreateUser from "../components/CreateUser";
import Header from "../components/Header";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface User {
  _id: string;
  name: string;
  phoneNo: number;
  amount: number;
  status: "Pending" | "Selected" | "Rejected";
  roles?: "admin" | "user";
  createdAt: string;
}

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);

    const result = await getUsers();

    if (result.success) {
      setUsers(result.data);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsCreateModalOpen(true);
  };

  const handleSubmitUser = async (userData: {
    name: string;
    phoneNo: number;
    amount: number;
    status: "Pending" | "Selected" | "Rejected";
    roles: "admin" | "user";
  }) => {
    let result;
    
    if (editingUser) {
      // Update existing user
      result = await updateUser(editingUser._id, userData);
    } else {
      // Create new user
      result = await CreateUsers(userData);
    }

    if (result.success) {
      // Refresh the users list
      await fetchUsers();
      // Close the modal and reset editing state
      setIsCreateModalOpen(false);
      setEditingUser(undefined);
    } else {
      alert(result.message || `Failed to ${editingUser ? 'update' : 'create'} user`);
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingUser(undefined);
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const result = await deleteUser(id);
      
      if (result.success) {
        // Refresh the users list
        await fetchUsers();
      } else {
        alert(result.message || "Failed to delete user");
      }
    }
  };

  const handleViewUser = (user: User) => {
    // TODO: Implement view functionality
    alert(`View user: ${user.name}`);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="User Management" showHomeButton={true} />
      
      <div className="p-6">
        {/* Create User Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create User
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {users.map((user) => (
            <UserCard 
              key={user._id} 
              user={user} 
              currentUser={currentUser}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onView={handleViewUser}
            />
          ))}
        </div>
      </div>

      <CreateUser
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitUser}
        editUser={editingUser}
      />
    </div>
  );
};

export default Users;