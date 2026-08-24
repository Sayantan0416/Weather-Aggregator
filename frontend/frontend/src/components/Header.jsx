function Header() {
  return (
    <header className="header">

      <div className="brand">

        <div className="brand-icon">
          <span>◒</span>
        </div>

        <div className="brand-copy">
          <h1>Weather Aggregator</h1>

          <p>
            REAL-TIME WEATHER INTELLIGENCE
          </p>
        </div>

      </div>


      <div className="header-right">

        <div className="header-meta">
          <span className="header-meta-label">
            ATMOSPHERIC DATA
          </span>

          <span className="header-meta-value">
            Open-Meteo
          </span>
        </div>


        <div className="status">

          <span className="status-dot"></span>

          <span>
            LIVE DATA
          </span>

        </div>

      </div>

    </header>
  );
}

export default Header;