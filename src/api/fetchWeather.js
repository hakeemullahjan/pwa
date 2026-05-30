import queuedAPI from "./QueueAPI";

const URL = "https://api.weatherapi.com/v1/current.json";
const API_KEY = "e6a274205381401b8a075731263005";

export const fetchWeather = async (cityName) => {
  let request = queuedAPI.get;

  return request(URL, {
    params: {
      q: cityName,
      key: API_KEY,
    },
  })
    .then((data) => {
      return data;
    })
    .catch((error) => console.log(error));
};
