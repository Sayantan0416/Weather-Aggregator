import httpx


GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"


async def geocode_location(
    name: str,
    district: str | None = None,
    state: str | None = None,
    country: str = "India",
):
    params = {
        "name": name,
        "count": 10,
        "language": "en",
        "format": "json",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            GEOCODING_URL,
            params=params,
        )

        response.raise_for_status()

        data = response.json()

    results = data.get("results") or []

    if not results:
        return None

    # Prefer India results.
    india_results = [
        result
        for result in results
        if result.get("country_code") == "IN"
        or result.get("country") == "India"
    ]

    if india_results:
        results = india_results

    # Prefer matching state.
    if state:
        state_matches = [
            result
            for result in results
            if state.lower() in (
                result.get("admin1") or ""
            ).lower()
        ]

        if state_matches:
            results = state_matches

    # Prefer matching district.
    if district:
        district_matches = [
            result
            for result in results
            if district.lower() in (
                result.get("admin2") or ""
            ).lower()
        ]

        if district_matches:
            results = district_matches

    return results[0]