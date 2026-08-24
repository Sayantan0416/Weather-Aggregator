function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Dense drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Moderate showers",
    82: "Violent showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
  };

  return descriptions[Number(code)] || "Unknown conditions";
}


function getWeatherIcon(code, isDay) {
  const value = Number(code);

  if (value === 0) {
    return isDay ? "☀️" : "🌙";
  }

  if (value === 1) {
    return isDay ? "🌤️" : "🌙";
  }

  if (value === 2) {
    return isDay ? "⛅" : "☁️";
  }

  if (value === 3) {
    return "☁️";
  }

  if ([45, 48].includes(value)) {
    return "🌫️";
  }

  if ([51, 53, 55].includes(value)) {
    return "🌦️";
  }

  if ([61, 63, 65, 80, 81, 82].includes(value)) {
    return "🌧️";
  }

  if ([71, 73, 75].includes(value)) {
    return "❄️";
  }

  if ([95, 96, 99].includes(value)) {
    return "⛈️";
  }

  return "🌤️";
}


function getWindDirection(degrees) {
  if (degrees === undefined || degrees === null) {
    return "--";
  }

  const directions = [
    "N",
    "NE",
    "E",
    "SE",
    "S",
    "SW",
    "W",
    "NW",
  ];

  const index = Math.round(degrees / 45) % 8;

  return directions[index];
}


function getTime(time) {
  if (!time) {
    return "--";
  }

  return new Date(time).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}


function CurrentWeather({ weather }) {

  const current = weather?.current;
  const location = weather?.location;
  const units = weather?.current_units;

  if (!current || !location) {
    return null;
  }


  /* =====================================================
     LOCATION
  ===================================================== */

  const city =
    location.name || "Unknown Location";

  const state =
    location.state || "";

  const country =
    location.country || "";


  /* =====================================================
     CURRENT CONDITIONS
  ===================================================== */

  const temperature =
    current.temperature_2m !== undefined
      ? Math.round(current.temperature_2m)
      : "--";


  const apparent =
    current.apparent_temperature !== undefined
      ? Math.round(current.apparent_temperature)
      : "--";


  const humidity =
    current.relative_humidity_2m !== undefined
      ? Math.round(current.relative_humidity_2m)
      : "--";


  const wind =
    current.wind_speed_10m !== undefined
      ? Math.round(current.wind_speed_10m)
      : "--";


  const gust =
    current.wind_gusts_10m !== undefined
      ? Math.round(current.wind_gusts_10m)
      : "--";


  const pressure =
    current.pressure_msl !== undefined
      ? Math.round(current.pressure_msl)
      : "--";


  const surfacePressure =
    current.surface_pressure !== undefined
      ? Math.round(current.surface_pressure)
      : "--";


  const cloudCover =
    current.cloud_cover !== undefined
      ? Math.round(current.cloud_cover)
      : "--";


  const rain =
    current.rain !== undefined
      ? current.rain
      : 0;


  const precipitation =
    current.precipitation !== undefined
      ? current.precipitation
      : 0;


  const windDirection =
    current.wind_direction_10m !== undefined
      ? Math.round(current.wind_direction_10m)
      : null;


  const weatherCode =
    current.weather_code;


  const isDay =
    Boolean(current.is_day);


  const description =
    getWeatherDescription(weatherCode);


  const icon =
    getWeatherIcon(weatherCode, isDay);


  /* =====================================================
     LOCATION DATA
  ===================================================== */

  const latitude =
    Number(location.latitude).toFixed(4);


  const longitude =
    Number(location.longitude).toFixed(4);


  /* =====================================================
     RENDER
  ===================================================== */

  return (
   <section
  className={`current-weather-card ${
    isDay ? "weather-day" : "weather-night"
  } weather-condition-${weatherCode}`}
>

      {/* =================================================
          TOP LOCATION BAR
      ================================================= */}

      <div className="weather-location-header">

        <div>

          <span className="current-label">
            CURRENT CONDITIONS
          </span>

          <h2 className="weather-city">
            {city}
          </h2>

          <p className="weather-region">
            {state}
            {state && country ? ", " : ""}
            {country}
          </p>

        </div>


        <div className="observation-status">

          <span className="live-dot"></span>

          <span>
            LIVE OBSERVATION
          </span>

        </div>

      </div>


      {/* =================================================
          MAIN WEATHER
      ================================================= */}

      <div className="weather-main-layout">

        <div className="weather-primary">

          <div className="weather-icon-large">
            {icon}
          </div>


          <div className="temperature-block">

            <div className="current-temperature">

              <strong>
                {temperature}
              </strong>

              <span>
                °
              </span>

              <small>
                C
              </small>

            </div>


            <div className="weather-description">

              <strong>
                {description}
              </strong>

              <span>
                Feels like {apparent}°C
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            OBSERVATION INFO
        ================================================= */}

        <div className="observation-panel">

          <div className="observation-time">

            <span>
              OBSERVED
            </span>

            <strong>
              {getTime(current.time)}
            </strong>

          </div>


          <div className="day-state">

            <span>
              {isDay ? "☀️" : "🌙"}
            </span>

            <div>

              <strong>
                {isDay ? "DAYTIME" : "NIGHTTIME"}
              </strong>

              <small>
                Local observation
              </small>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          WEATHER METRICS
      ================================================= */}

      <div className="weather-metrics">

        {/* HUMIDITY */}

        <div className="weather-metric">

          <div className="metric-top">
            <span className="metric-icon">
              💧
            </span>

            <span>
              HUMIDITY
            </span>
          </div>

          <strong>
            {humidity}%
          </strong>

          <small>
            Relative humidity
          </small>

        </div>


        {/* WIND */}

        <div className="weather-metric">

          <div className="metric-top">

            <span className="metric-icon">
              💨
            </span>

            <span>
              WIND
            </span>

          </div>

          <strong>
            {wind} km/h
          </strong>

          <small>
            {windDirection !== null
              ? `${getWindDirection(windDirection)} · ${windDirection}°`
              : "Direction unavailable"}
          </small>

        </div>


        {/* GUST */}

        <div className="weather-metric">

          <div className="metric-top">

            <span className="metric-icon">
              🌬️
            </span>

            <span>
              WIND GUST
            </span>

          </div>

          <strong>
            {gust} km/h
          </strong>

          <small>
            Maximum gust
          </small>

        </div>


        {/* PRESSURE */}

        <div className="weather-metric">

          <div className="metric-top">

            <span className="metric-icon">
              ◉
            </span>

            <span>
              PRESSURE
            </span>

          </div>

          <strong>
            {pressure} hPa
          </strong>

          <small>
            Sea-level pressure
          </small>

        </div>


        {/* CLOUD */}

        <div className="weather-metric">

          <div className="metric-top">

            <span className="metric-icon">
              ☁️
            </span>

            <span>
              CLOUD COVER
            </span>

          </div>

          <strong>
            {cloudCover}%
          </strong>

          <small>
            Atmospheric coverage
          </small>

        </div>


        {/* RAIN */}

        <div className="weather-metric">

          <div className="metric-top">

            <span className="metric-icon">
              🌧️
            </span>

            <span>
              RAIN
            </span>

          </div>

          <strong>
            {rain} mm
          </strong>

          <small>
            Current rainfall
          </small>

        </div>

      </div>


      {/* =================================================
          LOCATION / ATMOSPHERIC DETAILS
      ================================================= */}

      <div className="weather-details-row">


        {/* COORDINATES */}

        <div className="location-coordinates">

          <div className="detail-heading">
            LOCATION
          </div>

          <div className="coordinate-grid">

            <div>

              <span>
                LATITUDE
              </span>

              <strong>
                {latitude}°
              </strong>

            </div>


            <div>

              <span>
                LONGITUDE
              </span>

              <strong>
                {longitude}°
              </strong>

            </div>

          </div>

        </div>


        {/* ATMOSPHERIC DETAILS */}

        <div className="atmospheric-details">

          <div className="detail-heading">
            ATMOSPHERIC DATA
          </div>

          <div className="atmospheric-grid">

            <div>

              <span>
                SURFACE PRESSURE
              </span>

              <strong>
                {surfacePressure} hPa
              </strong>

            </div>


            <div>

              <span>
                PRECIPITATION
              </span>

              <strong>
                {precipitation} mm
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          WEATHER CODE
      ================================================= */}

      <div className="weather-footer">

        <span>
          WMO WEATHER CODE
        </span>

        <strong>
          {weatherCode}
        </strong>

        <span className="footer-separator">
          •
        </span>

        <span>
          TIMEZONE
        </span>

        <strong>
          {location.timezone || "--"}
        </strong>

      </div>

    </section>
  );
}


export default CurrentWeather;