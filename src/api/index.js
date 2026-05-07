export const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log("API URL from env:", apiUrl);
  return apiUrl || 'http://localhost:3000';
};