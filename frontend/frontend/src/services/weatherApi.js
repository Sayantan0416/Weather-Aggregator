import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 30000,
});

export const getWeather = async (query) => {
  const response = await API.get("/weather/", {
    params: {
      q: query,
    },
  });

  return response.data;
};

export const searchLocations = async (query) => {
  const response = await API.get("/locations/search", {
    params: {
      q: query,
    },
  });

  return response.data;
};

export default API;