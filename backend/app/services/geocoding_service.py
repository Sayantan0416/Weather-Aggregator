import httpx


GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"


async def search_locations(query: str, count: int = 10):
    query = query.strip()

    if not query:
        return []

    params = {
        "name": query,
        "count": count,
        "language": "en",
        "format": "json",
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(
            GEOCODING_URL,
            params=params,
        )

        response.raise_for_status()

        data = response.json()

    return data.get("results", [])


def _is_india(location):
    return location.get("country_code") == "IN"


def _is_west_bengal(location):
    return (
        _is_india(location)
        and location.get("admin1", "").strip().lower()
        == "west bengal"
    )


def _score_location(location, original_query):
    """
    Give better results a higher score.

    This is intentionally generic. It does NOT hardcode
    any particular district, PIN code or village.
    """

    score = 0

    name = str(location.get("name", "")).lower()
    country = str(location.get("country", "")).lower()
    country_code = str(location.get("country_code", "")).upper()
    admin1 = str(location.get("admin1", "")).lower()
    admin2 = str(location.get("admin2", "")).lower()
    admin3 = str(location.get("admin3", "")).lower()

    query = original_query.lower()

    # Exact name match
    first_part = query.split(",")[0].strip()

    if name == first_part:
        score += 100

    elif first_part and first_part in name:
        score += 50

    # Country preference when India is explicitly mentioned
    if "india" in query:
        if country_code == "IN":
            score += 100

    # West Bengal preference when explicitly mentioned
    if "west bengal" in query or "westbengal" in query:
        if admin1 == "west bengal":
            score += 100

    # Generic India preference for Indian-looking searches
    if country_code == "IN":
        score += 20

    # State / district textual matches
    query_parts = [
        part.strip()
        for part in query.split(",")
        if part.strip()
    ]

    for part in query_parts:
        if part in name:
            score += 20

        if part in country:
            score += 15

        if part in admin1:
            score += 30

        if part in admin2:
            score += 30

        if part in admin3:
            score += 30

    # Prefer actual populated places over broad administrative
    # regions when the API provides feature information.
    feature_code = str(
        location.get("feature_code", "")
    ).upper()

    if feature_code.startswith("PPL"):
        score += 10

    return score


async def geocode_location(
    name: str,
    district: str | None = None,
    state: str | None = None,
    country: str | None = None,
):
    """
    Generic geocoding function.

    It progressively tries:
        name + district + state + country
        name + district + state
        name + state + country
        name + state
        name + country
        name

    This allows small localities, districts, cities and countries
    to work without hardcoding individual places.
    """

    parts = [
        name,
        district,
        state,
        country,
    ]

    parts = [
        str(part).strip()
        for part in parts
        if part and str(part).strip()
    ]

    if not parts:
        return None

    queries = []

    # Most specific → least specific
    for length in range(len(parts), 0, -1):
        query = ", ".join(parts[:length])

        if query not in queries:
            queries.append(query)

    # Also try useful combinations
    if name and state and country:
        query = f"{name}, {state}, {country}"

        if query not in queries:
            queries.append(query)

    if name and state:
        query = f"{name}, {state}"

        if query not in queries:
            queries.append(query)

    if name and country:
        query = f"{name}, {country}"

        if query not in queries:
            queries.append(query)

    if name:
        if name not in queries:
            queries.append(name)

    all_results = []

    for query in queries:
        results = await search_locations(
            query,
            count=20,
        )

        if results:
            all_results.extend(results)

        # If we already have a strong exact result,
        # no need to keep searching.
        for result in results:
            if (
                result.get("name", "").strip().lower()
                == name.strip().lower()
            ):
                if country:
                    if (
                        result.get("country", "")
                        .strip()
                        .lower()
                        == country.strip().lower()
                    ):
                        return _format_location(result)

    if not all_results:
        return None

    # Remove duplicate results
    unique_results = {}

    for result in all_results:
        key = (
            result.get("id"),
            result.get("latitude"),
            result.get("longitude"),
        )

        unique_results[key] = result

    results = list(unique_results.values())

    # Score every result
    results.sort(
        key=lambda location: _score_location(
            location,
            ", ".join(parts),
        ),
        reverse=True,
    )

    best = results[0]

    return _format_location(best)


def _format_location(location):
    return {
        "latitude": location.get("latitude"),
        "longitude": location.get("longitude"),
        "name": location.get("name"),
        "country": location.get("country"),
        "country_code": location.get("country_code"),
        "admin1": location.get("admin1"),
        "admin2": location.get("admin2"),
        "admin3": location.get("admin3"),
        "timezone": location.get("timezone"),
        "population": location.get("population"),
        "feature_code": location.get("feature_code"),
    }