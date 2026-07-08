import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const searchPapers = async (query) => {
  const response = await apiClient.get(
    `/api/search?q=${encodeURIComponent(query)}`,
  );
  return response.data;
};
