// src/pages/Home.tsx

import { useEffect, useState } from "react";
import { getUsers, pickRandomUser } from "../service/users";
import UserCard from "../components/UserCard";
import Header from "../components/Header";
import { Users } from "lucide-react";

interface User {
  _id: string;
  name: string;
  phoneNo: number;
  chitNo: number;
  amount: number;
  status: "Pending" | "Selected" | "Rejected";
  roles?: "admin" | "user";
  createdAt: string;
}

type TabType = "random" | "all";

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("random");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);  

  useEffect(() => {
    fetchUsers();
  }, []);

  // Timer countdown for showing selected user
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (showResult && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Reset after 30 seconds
      setShowResult(false);
      setSelectedUser(null);
      setTimeLeft(30);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showResult, timeLeft]);

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

  // Random User Selection
  const handleRandomSelect = async () => {
    setIsSelecting(true);
    setSelectedUser(null);
    setShowResult(false);
    setTimeLeft(30);

    try {
      const result = await pickRandomUser();
      
      if (result.success) {
        // Show selected user from API response
        setSelectedUser(result.data.user);
        // Start the 30-second timer
        setShowResult(true);
        setTimeLeft(30);
        // Refresh users list to show updated status
        await fetchUsers();
      } else {
        alert(result.message || "Failed to select random user");
      }
    } catch (error) {
      alert("Error selecting random user. Please try again.");
    } finally {
      setIsSelecting(false);
    }
  };

  // Action Handlers
  const handleViewUser = (user: User) => {
    alert(`Viewing ${user.name}`);
  };

  const handleEditUser = (user: User) => {
    alert(`Editing ${user.name}`);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm("Delete this user?")) {
      alert(`Deleted user ${id}`);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl font-bold animate-pulse">
          Loading Users...
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-500 text-xl font-semibold">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Header title="🎯 Kattapai Chit Fund" />

      <div className="px-2 sm:px-4 lg:px-20 py-4 sm:py-6">

        {/* Tabs */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-200 p-2 mb-6 sm:mb-10">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">

            {/* Random Tab */}
            <button
              onClick={() => setActiveTab("random")}
              className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                activeTab === "random"
                  ? "bg-indigo-100 text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              🎲 Random Select
            </button>

            {/* All Users Tab */}
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 flex items-center justify-center px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                activeTab === "all"
                  ? "bg-purple-100 text-purple-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />

              All Users

              <span className="ml-1 sm:ml-2 px-1 sm:px-2 py-0.5 sm:py-1 bg-purple-200 text-purple-800 rounded-full text-xs">
                {users.length}
              </span>
            </button>
          </div>
        </div>

        {/* RANDOM TAB */}
        {activeTab === "random" && (
          <div className="space-y-8 md:space-y-12 lg:space-y-16">

            {/* Select Button */}
            <div className="flex justify-center">
              <button
                onClick={handleRandomSelect}
                disabled={isSelecting || showResult}
                className={`px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-2xl sm:rounded-3xl text-white font-bold text-base sm:text-lg lg:text-xl shadow-2xl transition-all duration-300 ${
                  isSelecting || showResult
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:scale-105"
                }`}
              >
                {isSelecting
                  ? "🎰 Selecting..."
                  : showResult
                  ? `⏰ Next: ${timeLeft}s`
                  : "🎯 Pick Winner"}
              </button>
            </div>

            {/* Animation */}
            {isSelecting && (
              <div className="flex justify-center">
                <div className="flex gap-3">
                  <div className="w-5 h-5 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-5 h-5 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-5 h-5 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}

            {/* Selected User */}
            {selectedUser && !isSelecting && (
              <div className="space-y-6">

                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-green-600">
                    🎉 Winner Selected
                  </h2>

                  <p className="text-gray-600 mt-2">
                    Congratulations to the selected user
                  </p>
                </div>

                <div className="max-w-md mx-auto">
                  <UserCard
                    user={selectedUser}
                    onView={handleViewUser}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                </div>
              </div>
            )}

            {!selectedUser && !isSelecting && (
              <div className="text-center text-gray-500 text-lg">
                Click the button to randomly select a winner
              </div>
            )}
          </div>
        )}

        {/* ALL USERS TAB */}
        {activeTab === "all" && (
          <div>

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                All Users
              </h2>

              <p className="text-gray-600 mt-1">
                Total Users: {users.length}
              </p>
            </div>

            {/* Empty State */}
            {users.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center text-gray-500">
                No users found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    onView={handleViewUser}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;