import API from "../api/axios";

// Fetch a single chit‑cycle by its Mongo _id
export const getChitCycleById = async (id: string) => {
  try {
    const response = await API.get(`/chitcycles/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Get Chit Cycle Error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch chit cycle',
    };
  }
};
