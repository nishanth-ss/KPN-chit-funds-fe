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

  // Animation States
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Countdown Timer After Winner Selected
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (showResult && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowResult(false);
      setSelectedUser(null);
      setTimeLeft(30);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showResult, timeLeft]);

  // Fetch Users
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

  // Random Winner Selection
  const handleRandomSelect = async () => {
    if (users.length === 0) return;

    setIsSelecting(true);
    setSelectedUser(null);
    setShowResult(false);
    setTimeLeft(30);

    try {
      // Get Winner From Backend
      const result = await pickRandomUser();

      if (!result.success) {
        alert(result.message || "Failed to select winner");
        setIsSelecting(false);
        return;
      }

      const winner = result.data.user;

      // Start Animation
      let index = 0;

      const rouletteInterval = setInterval(() => {
        setCurrentIndex(index % users.length);
        index++;
      }, 100);

      // Stop Animation After 15 Seconds
      setTimeout(async () => {
        clearInterval(rouletteInterval);

        setSelectedUser(winner);

        setShowResult(true);

        setTimeLeft(30);

        await fetchUsers();

        setIsSelecting(false);
      }, 15000);
    } catch (error) {
      alert("Error selecting winner");
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

  // Loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-3xl font-bold animate-pulse">
          Loading Users...
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-500 text-xl font-bold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-indigo-50 to-purple-100">
      <Header title="🎯 Kattapai Chit Fund" />

      <div className="px-4 sm:px-6 lg:px-20 py-6">

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-2 mb-10">
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Random Tab */}
            <button
              onClick={() => setActiveTab("random")}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                activeTab === "random"
                  ? "bg-indigo-100 text-indigo-700 shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              🎲 Random Select
            </button>

            {/* All Users Tab */}
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                activeTab === "all"
                  ? "bg-purple-100 text-purple-700 shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users className="w-5 h-5 mr-2" />

              All Users

              <span className="ml-2 px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-xs">
                {users.length}
              </span>
            </button>
          </div>
        </div>

        {/* RANDOM TAB */}
        {activeTab === "random" && (
          <div className="space-y-12">

            {/* PICK BUTTON */}
            <div className="flex justify-center">
              <button
                onClick={handleRandomSelect}
                disabled={isSelecting || showResult}
                className={`px-10 py-5 rounded-3xl text-white font-extrabold text-xl shadow-2xl transition-all duration-300 ${
                  isSelecting || showResult
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:scale-105"
                }`}
              >
                {isSelecting
                  ? "🎰 Selecting Winner..."
                  : showResult
                  ? `⏰ Next Round: ${timeLeft}s`
                  : "🎯 Pick Winner"}
              </button>
            </div>

            {/* ANIMATION */}
            {isSelecting && (
              <div className="flex flex-col items-center justify-center space-y-10">

                {/* Spinner */}
                <div className="relative">

                  <div className="w-52 h-52 rounded-full border-[14px] border-indigo-500 border-t-pink-500 animate-spin shadow-2xl"></div>

                  <div className="absolute inset-0 flex items-center justify-center text-6xl">
                    🎯
                  </div>
                </div>

                {/* Animated User Card */}
                <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center animate-pulse border border-indigo-100">

                  <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">
                    Selecting Lucky Winner...
                  </h2>

                  {users[currentIndex] && (
                    <div className="space-y-3">

                      <p className="text-4xl font-black text-purple-700">
                        {users[currentIndex].name}
                      </p>

                      <p className="text-xl text-gray-600">
                        📞 {users[currentIndex].phoneNo}
                      </p>

                      <p className="text-lg text-gray-500">
                        🎟️ Chit No: {users[currentIndex].chitNo}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WINNER RESULT */}
            {selectedUser && !isSelecting && (
              <div className="space-y-8">

                <div className="text-center animate-bounce">

                  <h2 className="text-5xl font-black text-green-600">
                    🎉 Winner Selected 🎉
                  </h2>

                  <p className="text-gray-600 mt-4 text-lg">
                    Congratulations to the lucky member
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

            {/* Empty State */}
            {!selectedUser && !isSelecting && (
              <div className="text-center text-gray-500 text-xl">
                Click the button to randomly select a winner
              </div>
            )}
          </div>
        )}

        {/* ALL USERS TAB */}
        {activeTab === "all" && (
          <div>

            {/* Heading */}
            <div className="mb-8">

              <h2 className="text-4xl font-bold text-gray-900">
                All Users
              </h2>

              <p className="text-gray-600 mt-2">
                Total Users: {users.length}
              </p>
            </div>

            {/* Empty */}
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