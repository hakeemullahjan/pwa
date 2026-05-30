import React, { useState } from "react";
import { fetchWeather } from "./api/fetchWeather";

const App = () => {
  // const [data, setData] = useState({
  //   cityName: "",
  //   weatherData: null,
  //   error: null,
  // });

  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (e) => {
    console.log("fetchData");
    if (e.key === "Enter") {
      try {
        console.log("Enter");
        const { data } = await fetchWeather(cityName);
        console.log("data", data);
        setWeatherData(data);
        setCityName("");
        setError(null);
      } catch (error) {
        //
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="type city name"
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        onKeyDown={fetchData}
      />

      {error && <div style={{ color: "red" }}>{error}</div>}

      {weatherData && weatherData?.location && (
        <div>
          <h2>
            {weatherData.location.name},{weatherData.location.region},
            {weatherData.location.country}
          </h2>

          {/* <p>Lat: {weatherData.location} C </p> */}
          {/* <p>Lon: {weatherData.current?.condition?.text}</p> */}

          <p>Temperature: {weatherData.current?.temp_c} C </p>
          <p>Condition: {weatherData.current?.condition?.text}</p>
          <img
            src={weatherData.current?.condition?.icon}
            alt={weatherData.current?.condition?.icon}
          />
          <p>Humidity: {weatherData.current?.humidity}</p>
          <p>Pressure: {weatherData.current?.pressure_mb}</p>
        </div>
      )}
    </div>
  );
};

export default App;
