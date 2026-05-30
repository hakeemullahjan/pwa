import axios from "axios";

const URL = "https://api.weatherapi.com/v1/current.json";
const API_KEY = "e6a274205381401b8a075731263005";

export const fetchWeather = async (cityName) => {
  return axios.get(URL, {
    params: {
      q: cityName,
      key: API_KEY,
    },
  });
};
