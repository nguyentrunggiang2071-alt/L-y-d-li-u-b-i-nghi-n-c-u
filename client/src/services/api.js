import axios from "axios";

export const searchPapers = async (query) => {
  const response = await axios.get(
    `/api/search?q=${encodeURIComponent(query)}`,
  );
  return response.data;
};
