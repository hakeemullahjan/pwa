import React, { useEffect, useState } from "react";
import { fetchWeather } from "./api/fetchWeather";

const App = () => {
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recent_searches")) ?? {},
  );
  const [tempPreference, setTempPreference] = useState(
    localStorage.getItem("temp_preference") ?? "temp_c",
  );

  const [online, setOnline] = useState(navigator.onLine ?? false);

  // console.log("recentSearches", recentSearches);
  // console.log("userLocation", userLocation);

  // console.log("online", online);

  const fetchData = async (ct) => {
    console.log("fetchData", ct);
    try {
      // console.log("Enter");
      const data = await fetchWeather(ct);
      console.log("data", data);
      setWeatherData(data);
      setCityName("");
      setError(null);
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    const newObj = { ...recentSearches };
    if (weatherData && weatherData.location) {
      if (!recentSearches[weatherData.location.name]) {
        newObj[weatherData.location.name] = weatherData;

        setRecentSearches(newObj);
        localStorage.setItem("recent_searches", JSON.stringify(newObj));
      }
    }
  }, [weatherData, recentSearches]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchData(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    setInterval(() => {
      setOnline(navigator.onLine ?? false);
    }, 2000);
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="type city name"
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            fetchData(cityName);
          }
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "end",
        }}
      >
        <p>
          Current Preference:
          {tempPreference === "temp_c" ? "Celsius" : "Fahrenheit"}{" "}
        </p>
        <button
          onClick={(e) => {
            const localPref = tempPreference === "temp_c" ? "temp_f" : "temp_c";
            setTempPreference(localPref);
            localStorage.setItem("temp_preference", localPref);
          }}
        >
          Change to {tempPreference === "temp_c" ? "Fahrenheit" : "Celsius"}
        </button>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <h4>Status: {online === true ? "Online" : "Offline"}</h4>

      <div>
        <h5>Recent Searches</h5>
        <ul>
          {Object.keys(recentSearches).map((recent) => {
            // console.log("recent", recent);
            return (
              <li key={recent}>
                <button type="button" onClick={(e) => fetchData(recent)}>
                  {recent}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {weatherData && weatherData?.location && (
        <div>
          <h2>
            {weatherData.location.name},{weatherData.location.region},
            {weatherData.location.country}
          </h2>

          {/* <p>Lat: {weatherData.location} C </p> */}
          {/* <p>Lon: {weatherData.current?.condition?.text}</p> */}

          <p>
            Temperature:{" "}
            {tempPreference === "temp_c"
              ? weatherData.current?.temp_c
              : weatherData.current?.temp_f}
            {tempPreference === "temp_c" ? " C" : " F"}
          </p>
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
