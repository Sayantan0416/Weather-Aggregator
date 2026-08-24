function WeatherMetrics({ weather }) {
  const current = weather?.current;

  if (!current) {
    return null;
  }


  const metrics = [
    {
      icon: "💧",
      label: "Humidity",
      value:
        current.relative_humidity_2m !== undefined
          ? `${Math.round(current.relative_humidity_2m)}%`
          : "--",
    },

    {
      icon: "💨",
      label: "Wind",
      value:
        current.wind_speed_10m !== undefined
          ? `${Math.round(current.wind_speed_10m)} km/h`
          : "--",
    },

    {
      icon: "☁️",
      label: "Cloud Cover",
      value:
        current.cloud_cover !== undefined
          ? `${Math.round(current.cloud_cover)}%`
          : "--",
    },

    {
      icon: "🌡️",
      label: "Pressure",
      value:
        current.pressure_msl !== undefined
          ? `${Math.round(current.pressure_msl)} hPa`
          : "--",
    },

    {
      icon: "🌧️",
      label: "Precipitation",
      value:
        current.precipitation !== undefined
          ? `${Number(current.precipitation).toFixed(1)} mm`
          : "--",
    },

    {
      icon: "🌬️",
      label: "Wind Gust",
      value:
        current.wind_gusts_10m !== undefined
          ? `${Math.round(current.wind_gusts_10m)} km/h`
          : "--",
    },
  ];


  return (
    <section className="metrics-section">

      <div className="section-heading">

        <span>
          ATMOSPHERIC DATA
        </span>

        <h3>
          Current conditions
        </h3>

      </div>


      <div className="metrics-grid">

        {metrics.map((metric) => (

          <div
            className="metric-card"
            key={metric.label}
          >

            <div className="metric-icon">
              {metric.icon}
            </div>

            <div>

              <span>
                {metric.label}
              </span>

              <strong>
                {metric.value}
              </strong>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}


export default WeatherMetrics;