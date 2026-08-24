function getIcon(code) {
  const value = Number(code);

  if (value === 0) return "☀️";
  if (value === 1) return "🌤️";
  if (value === 2) return "⛅";
  if (value === 3) return "☁️";

  if ([45, 48].includes(value)) return "🌫️";

  if ([51, 53, 55].includes(value)) return "🌦️";

  if ([61, 63, 65, 80, 81, 82].includes(value)) {
    return "🌧️";
  }

  if ([71, 73, 75].includes(value)) return "❄️";

  if ([95, 96, 99].includes(value)) return "⛈️";

  return "🌤️";
}


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


function HourlyForecast({ weather }) {
  const hourly = weather?.hourly;

  if (!hourly?.time?.length) {
    return null;
  }


  const now = new Date();


  const items = hourly.time
    .map((time, index) => ({
      time,
      temperature:
        hourly.temperature_2m?.[index],
      apparent:
        hourly.apparent_temperature?.[index],
      humidity:
        hourly.relative_humidity_2m?.[index],
      probability:
        hourly.precipitation_probability?.[index],
      weatherCode:
        hourly.weather_code?.[index],
      wind:
        hourly.wind_speed_10m?.[index],
    }))
    .filter((item) => {
      return new Date(item.time) >= now;
    })
    .slice(0, 12);


  return (
    <section className="forecast-section hourly-section">

      {/* ===================================================
          SECTION HEADER
      =================================================== */}

      <div className="section-heading">

        <div className="section-heading-main">

          <span className="section-eyebrow">
            ATMOSPHERIC TIMELINE
          </span>

          <h3>
            Hourly Forecast
          </h3>

          <p>
            Track how conditions evolve throughout the day.
          </p>

        </div>


        <div className="forecast-count">

          <span className="forecast-count-dot"></span>

          NEXT 12 HOURS

        </div>

      </div>


      {/* ===================================================
          HOURLY CARDS
      =================================================== */}

      <div className="hourly-container">

        <div className="hourly-scroll">

          {items.map((item, index) => {

            const date = new Date(item.time);


            const temperature =
              item.temperature !== undefined
                ? Math.round(item.temperature)
                : "--";


            const probability =
              item.probability !== undefined
                ? Math.round(item.probability)
                : 0;


            const humidity =
              item.humidity !== undefined
                ? Math.round(item.humidity)
                : "--";


            const wind =
              item.wind !== undefined
                ? Math.round(item.wind)
                : "--";


            const description =
              getDescription(item.weatherCode);


            return (
              <article
                className={`hour-card ${
                  index === 0
                    ? "hour-card-active"
                    : ""
                }`}
                key={item.time}
              >

                {/* Card top */}

                <div className="hour-card-top">

                  <span className="hour-time">

                    {index === 0
                      ? "NOW"
                      : date.toLocaleTimeString([], {
                          hour: "numeric",
                        })}

                  </span>


                  {index === 0 && (
                    <span className="hour-now-indicator">
                      LIVE
                    </span>
                  )}

                </div>


                {/* Weather icon */}

                <div className="hour-icon-wrapper">

                  <div className="hour-icon-glow"></div>

                  <div className="hour-icon">
                    {getIcon(item.weatherCode)}
                  </div>

                </div>


                {/* Temperature */}

                <div className="hour-temperature">

                  <strong>
                    {temperature}
                  </strong>

                  <span>
                    °
                  </span>

                </div>


                {/* Description */}

                <span className="hour-description">
                  {description}
                </span>


                {/* Details */}

                <div className="hour-details">

                  <div>

                    <span className="hour-detail-icon">
                      💧
                    </span>

                    <span>
                      {probability}%
                    </span>

                  </div>


                  <div>

                    <span className="hour-detail-icon">
                      💨
                    </span>

                    <span>
                      {wind} km/h
                    </span>

                  </div>


                  <div>

                    <span className="hour-detail-icon">
                      ◌
                    </span>

                    <span>
                      {humidity}%
                    </span>

                  </div>

                </div>

              </article>
            );
          })}

        </div>

      </div>

    </section>
  );
}


export default HourlyForecast;