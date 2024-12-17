import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

export const getListings = async () => {
  try {
    const res = await api.get("/listings");
    return res.data.data;
  } catch (err) {
    console.log(err);
  }
};
