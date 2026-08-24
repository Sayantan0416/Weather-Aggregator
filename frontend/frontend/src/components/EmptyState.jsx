function EmptyState() {
  return (
    <section className="empty-state">

      <div className="empty-globe">
        ◉
      </div>

      <div className="empty-content">

        <span>
          WEATHER EXPLORER
        </span>

        <h3>
          Discover the atmosphere
        </h3>

        <p>
          Search for a city, locality or Indian PIN code
          to begin your weather analysis.
        </p>

      </div>

      <div className="empty-hints">

        <div>
          <strong>01</strong>
          Search a location
        </div>

        <div>
          <strong>02</strong>
          Explore conditions
        </div>

        <div>
          <strong>03</strong>
          View forecasts
        </div>

      </div>

    </section>
  );
}


export default EmptyState;