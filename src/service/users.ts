import API from "../api/axios";

// Get all users
export const getUsers = async () => {
  try {
    const response = await API.get("/users");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Get Users Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong",
    };
  }
};

// Get user by ID
export const getUserById = async (id: string) => {
  try {
    const response = await API.get(`/users/${id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Get User By ID Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "User not found",
    };
  }
};

// Create user
export const CreateUsers = async (userData: {
  name: string;
  phoneNo: number;
  chitNo: number;
  amount: number;
  status: "Pending" | "Selected" | "Rejected";
  roles: "admin" | "user";
}) => {
  try {
    const response = await API.post("/users", userData);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Create User Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong while creating user",
    };
  }
};

// Update user
export const updateUser = async (id: string, userData: {
  name: string;
  phoneNo: number;
  chitNo: number;
  amount: number;
  status: "Pending" | "Selected" | "Rejected";
  roles: "admin" | "user";
}) => {
  try {
    const response = await API.put(`/users/${id}`, userData);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Update User Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong while updating user",
    };
  }
};

// Delete user
export const deleteUser = async (id: string) => {
  try {
    const response = await API.delete(`/users/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to delete user" };
  }
};

export const pickRandomUser = async () => {
  try {
    const response = await API.post('/users/pick-random');
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to pick random user" };
  }
};

// Get user with history
export const getUserWithHistory = async (id: string) => {
  try {
    const response = await API.get(`/users/${id}/history`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch user history",
    };
  }
};

