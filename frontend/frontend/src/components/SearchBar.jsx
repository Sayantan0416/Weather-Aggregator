function SearchBar({
  query,
  setQuery,
  onSearch,
  loading,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!query.trim() || loading) {
      return;
    }

    onSearch(query);
  };

  return (
    <form
      className="search-wrapper"
      onSubmit={handleSubmit}
    >

      {/* Search icon */}

      <div className="search-icon">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="11"
            cy="11"
            r="6.5"
          />

          <path
            d="M16 16L21 21"
          />
        </svg>
      </div>


      {/* Input */}

      <div className="search-input-area">

        <span className="search-label">
          LOCATION
        </span>

        <input
          type="text"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search city, locality or Indian PIN code..."
          disabled={loading}
          autoComplete="off"
          aria-label="Search for a location"
        />

      </div>


      {/* Search button */}

      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="search-button"
      >

        {loading ? (
          <>
            <span className="button-spinner"></span>

            <span>
              SEARCHING
            </span>
          </>
        ) : (
          <>
            <span>
              EXPLORE
            </span>

            <span className="button-arrow">
              →
            </span>
          </>
        )}

      </button>

    </form>
  );
}

export default SearchBar;