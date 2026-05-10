import API from "../api/axios";

export const createUser = async (userData: {
  name: string;
  phoneNo: number;
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
  } catch (error: any) {
    console.error("Create User Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong while creating user",
    };
  }
};
