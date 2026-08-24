function getDescription(code) {
  const descriptions = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Dense drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Rain showers",
    82: "Heavy showers",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm",
  };

  return descriptions[Number(code)] || "Unknown";
}


function getIcon(code) {
  const value = Number(code);

  if (value === 0) return "☀️";
  if (value === 1) return "🌤️";
  if (value === 2) return "⛅";
  if (value === 3) return "☁️";

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


function DailyForecast({ weather }) {
  const daily = weather?.daily;

  if (!daily?.time?.length) {
    return null;
  }


  return (
    <section className="forecast-section daily-section">

      {/* ===================================================
          SECTION HEADER
      =================================================== */}

      <div className="section-heading">

        <div className="section-heading-main">

          <span className="section-eyebrow">
            EXTENDED OUTLOOK
          </span>

          <h3>
            7-Day Forecast
          </h3>

          <p>
            A broader view of the weather ahead.
          </p>

        </div>


        <div className="forecast-count">

          <span className="forecast-count-dot"></span>

          SEVEN DAYS

        </div>

      </div>


      {/* ===================================================
          DAILY FORECAST GRID
      =================================================== */}

      <div className="daily-grid">

        {daily.time.map((dateString, index) => {

          const date = new Date(
            `${dateString}T00:00:00`
          );


          const max =
            daily.temperature_2m_max?.[index];


          const min =
            daily.temperature_2m_min?.[index];


          const rain =
            daily.precipitation_probability_max?.[index];


          const wind =
            daily.wind_speed_10m_max?.[index];


          const code =
            daily.weather_code?.[index];


          const temperatureHigh =
            max !== undefined
              ? Math.round(max)
              : "--";


          const temperatureLow =
            min !== undefined
              ? Math.round(min)
              : "--";


          const rainProbability =
            rain !== undefined
              ? Math.round(rain)
              : 0;


          const maxWind =
            wind !== undefined
              ? Math.round(wind)
              : "--";


          return (
            <article
              className={`day-card ${
                index === 0
                  ? "day-card-today"
                  : ""
              }`}
              key={dateString}
            >

              {/* =================================================
                  TOP
              ================================================= */}

              <div className="day-top">

                <div>

                  <span className="day-name">

                    {index === 0
                      ? "TODAY"
                      : date.toLocaleDateString([], {
                          weekday: "short",
                        })}

                  </span>

                  <small className="day-date">

                    {date.toLocaleDateString([], {
                      day: "numeric",
                      month: "short",
                    })}

                  </small>

                </div>


                {index === 0 && (
                  <span className="day-current-badge">
                    NOW
                  </span>
                )}

              </div>


              {/* =================================================
                  WEATHER ICON
              ================================================= */}

              <div className="day-icon-wrapper">

                <div className="day-icon-glow"></div>

                <div className="day-icon">
                  {getIcon(code)}
                </div>

              </div>


              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <strong className="day-description">
                {getDescription(code)}
              </strong>


              {/* =================================================
                  TEMPERATURE
              ================================================= */}

              <div className="day-temperature">

                <strong>
                  {temperatureHigh}°
                </strong>

                <span>
                  {temperatureLow}°
                </span>

              </div>


              {/* =================================================
                  DETAILS
              ================================================= */}

              <div className="day-details">

                <div>

                  <span>
                    PRECIPITATION
                  </span>

                  <strong>
                    {rainProbability}%
                  </strong>

                </div>


                <div>

                  <span>
                    MAX WIND
                  </span>

                  <strong>
                    {maxWind} km/h
                  </strong>

                </div>

              </div>

            </article>
          );
        })}

      </div>

    </section>
  );
}


export default DailyForecast;