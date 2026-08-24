import { useState } from "react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";

import { getWeather } from "./services/weatherApi";


// ============================================================
// WEATHER THEME
// ============================================================

function getWeatherTheme(code) {
  const value = Number(code);

  if (value === 0) {
    return "clear";
  }

  if ([1, 2].includes(value)) {
    return "partly-cloudy";
  }

  if (value === 3) {
    return "cloudy";
  }

  if ([45, 48].includes(value)) {
    return "fog";
  }

  if ([51, 53, 55, 56, 57].includes(value)) {
    return "drizzle";
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(value)) {
    return "rain";
  }

  if ([71, 73, 75, 77, 85, 86].includes(value)) {
    return "snow";
  }

  if ([95, 96, 99].includes(value)) {
    return "storm";
  }

  return "default";
}


// ============================================================
// WEATHER ICON
// ============================================================

function getWeatherIcon(code, isDay = 1) {
  const value = Number(code);

  if (value === 0) {
    return isDay ? "☀️" : "🌙";
  }

  if (value === 1) {
    return isDay ? "🌤️" : "🌙";
  }

  if (value === 2) {
    return "⛅";
  }

  if (value === 3) {
    return "☁️";
  }

  if ([45, 48].includes(value)) {
    return "🌫️";
  }

  if ([51, 53, 55, 56, 57].includes(value)) {
    return "🌦️";
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(value)) {
    return "🌧️";
  }

  if ([71, 73, 75, 77, 85, 86].includes(value)) {
    return "❄️";
  }

  if ([95, 96, 99].includes(value)) {
    return "⛈️";
  }

  return isDay ? "🌤️" : "🌙";
}


// ============================================================
// APP
// ============================================================

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // ==========================================================
  // SEARCH
  // ==========================================================

  const handleSearch = async (value) => {
    if (!value || !value.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getWeather(value.trim());

      console.log(
        "WEATHER LOCATION:",
        data?.location?.latitude,
        data?.location?.longitude
      );

      console.log("FULL WEATHER DATA:", data);

      setWeather(data);

    } catch (err) {
      console.error("WEATHER ERROR:", err);

      setWeather(null);

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(
          "Unable to fetch weather data. Please check the location and try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  // ==========================================================
  // DYNAMIC WEATHER INFORMATION
  // ==========================================================

  const currentWeather = weather?.current;

  const weatherCode = currentWeather?.weather_code;

  const isDay = currentWeather?.is_day === 1;

  const weatherTheme = weather
    ? getWeatherTheme(weatherCode)
    : "default";

  const weatherIcon = weather
    ? getWeatherIcon(weatherCode, isDay)
    : "🌤️";


  // ==========================================================
  // DYNAMIC APP CLASS
  // ==========================================================

  const appClassName = [
    "app",
    `weather-${weatherTheme}`,
    isDay ? "theme-day" : "theme-night",
  ].join(" ");


  return (
    <div className={appClassName}>

      {/* =====================================================
          ATMOSPHERIC BACKGROUND
      ===================================================== */}

      <div className="atmosphere">

        <div className="atmosphere-glow"></div>

        <div className="atmosphere-orb atmosphere-orb-one"></div>

        <div className="atmosphere-orb atmosphere-orb-two"></div>

      </div>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header />


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="main-container">


        {/* ===================================================
            HERO
        =================================================== */}

        <section className="hero-section">

          <div className="hero-content">

            <span className="hero-eyebrow">
              WEATHER INTELLIGENCE
            </span>


            <h2>

              Understand the
              <br />

              <span>
                atmosphere.
              </span>

            </h2>


            <p>
              Real-time weather conditions, hourly changes,
              and extended forecasts for any city, locality,
              or Indian PIN code.
            </p>


            {/* Dynamic weather status */}

            {weather && (

              <div className="hero-weather-status">

                <span className="hero-weather-icon">
                  {weatherIcon}
                </span>

                <div>

                  <strong>
                    {weather.location?.name}
                  </strong>

                  <span>
                    {weatherTheme.replace("-", " ")}
                    {" · "}
                    {isDay ? "Daytime" : "Night"}
                  </span>

                </div>

              </div>

            )}

          </div>


          {/* =================================================
              HERO VISUAL
          ================================================= */}

          <div className="hero-visual">

            <div className="hero-orbit hero-orbit-one"></div>

            <div className="hero-orbit hero-orbit-two"></div>

            <div className="hero-glow"></div>


            <div className="hero-weather-symbol">

              {weatherIcon}

            </div>

          </div>

        </section>


        {/* ===================================================
            SEARCH
        =================================================== */}

        <section className="search-section">

          <div className="search-heading">

            <div>

              <span>
                EXPLORE WEATHER
              </span>

              <h3>
                Find a location
              </h3>

            </div>


            <span className="search-hint">
              CITY · LOCALITY · PIN CODE
            </span>

          </div>


          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            loading={loading}
          />

        </section>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (

          <div className="error-message">

            <span className="error-icon">
              !
            </span>


            <div>

              <strong>
                Weather unavailable
              </strong>

              <p>
                {error}
              </p>

            </div>

          </div>

        )}


        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (

          <section className="loading-state">

            <div className="loading-orb">

              <div className="loading-spinner"></div>

            </div>


            <div className="loading-content">

              <span>
                WEATHER INTELLIGENCE
              </span>

              <p>
                Gathering atmospheric data...
              </p>

            </div>

          </section>

        )}


        {/* ===================================================
            WEATHER DASHBOARD
        =================================================== */}

        {weather && !loading && (

          <section className="weather-dashboard">

            <CurrentWeather
              weather={weather}
            />


            <HourlyForecast
              weather={weather}
            />


            <DailyForecast
              weather={weather}
            />

          </section>

        )}


        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {!weather && !loading && !error && (

          <section className="empty-state">

            <div className="empty-visual">

              <div className="empty-ring empty-ring-one"></div>

              <div className="empty-ring empty-ring-two"></div>

              <div className="empty-weather-icon">
                🌤️
              </div>

            </div>


            <div className="empty-content">

              <span>
                YOUR WEATHER DASHBOARD
              </span>


              <h3>
                Search for a location
              </h3>


              <p>
                Enter a city, locality, or Indian PIN code
                above to reveal real-time atmospheric
                conditions and forecasts.
              </p>

            </div>


            <div className="empty-hints">

              <div>

                <strong>
                  CITY
                </strong>

                Kolkata

              </div>


              <div>

                <strong>
                  LOCALITY
                </strong>

                Salt Lake

              </div>


              <div>

                <strong>
                  PIN
                </strong>

                700001

              </div>

            </div>

          </section>

        )}

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div>
          Weather Aggregator
        </div>


        <div>
          Real-time weather intelligence
        </div>


        <div>
          Built by Sayantan De
        </div>

      </footer>

    </div>
  );
}


export default App;