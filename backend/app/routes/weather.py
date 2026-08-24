from fastapi import APIRouter, HTTPException, Query

from app.services.pincode_service import search_pincode
from app.services.geocoding_service import (
    search_locations,
    geocode_location,
)
from app.services.weather_service import get_weather


router = APIRouter(
    prefix="/weather",
    tags=["Weather"],
)


@router.get("/")
async def weather_search(
    q: str = Query(
        ...,
        min_length=1,
        description="City, locality, district, country or Indian PIN code",
    )
):
    query = q.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Location cannot be empty.",
        )

    # =========================================================
    # 1. INDIAN PIN CODE
    # =========================================================

    if query.isdigit() and len(query) == 6:

        pincode_data = await search_pincode(query)

        if not pincode_data:
            raise HTTPException(
                status_code=404,
                detail=f"No locations found for PIN code {query}",
            )

        post_offices = pincode_data.get(
            "post_offices",
            []
        )

        if not post_offices:
            raise HTTPException(
                status_code=404,
                detail=f"No locations found for PIN code {query}",
            )

        # -----------------------------------------------------
        # Try every post office until one can be geocoded.
        # This is important because the first post office
        # returned by the PIN API may not exist in the
        # geocoding database.
        # -----------------------------------------------------

        coordinates = None
        selected_post_office = None

        for post_office in post_offices:

            coordinates = await geocode_location(
                post_office.get("Name"),
                post_office.get("District"),
                post_office.get("State"),
                post_office.get("Country"),
            )

            if coordinates:
                selected_post_office = post_office
                break

        # -----------------------------------------------------
        # If individual post offices cannot be geocoded,
        # try the district/state combination.
        # -----------------------------------------------------

        if not coordinates:

            first = post_offices[0]

            coordinates = await geocode_location(
                first.get("District"),
                None,
                first.get("State"),
                first.get("Country"),
            )

            if coordinates:
                selected_post_office = first

        if not coordinates:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"Could not determine coordinates for "
                    f"PIN code {query}."
                ),
            )

        weather = await get_weather(
            coordinates["latitude"],
            coordinates["longitude"],
        )

        return {
            "location": {
                "name": selected_post_office.get("Name"),
                "district": selected_post_office.get("District"),
                "state": selected_post_office.get("State"),
                "country": selected_post_office.get("Country"),
                "pincode": selected_post_office.get("Pincode"),
                "latitude": coordinates["latitude"],
                "longitude": coordinates["longitude"],
                "timezone": coordinates.get("timezone"),
            },

            "search": {
                "query": query,
                "type": "pincode",
            },

            "current": weather.get("current"),
            "current_units": weather.get("current_units"),

            "hourly": weather.get("hourly"),
            "hourly_units": weather.get("hourly_units"),

            "daily": weather.get("daily"),
            "daily_units": weather.get("daily_units"),

            "timezone": weather.get("timezone"),
        }

    # =========================================================
    # 2. CITY / LOCALITY / DISTRICT / STATE / COUNTRY
    # =========================================================

    # First try the complete user query.
    results = await search_locations(
        query,
        count=20,
    )

    # ---------------------------------------------------------
    # If the query contains commas, use our smarter geocoder.
    #
    # Example:
    # Rasulpur, West Midnapore, West Bengal
    # ---------------------------------------------------------

    if "," in query:

        parts = [
            part.strip()
            for part in query.split(",")
            if part.strip()
        ]

        name = parts[0]
        district = parts[1] if len(parts) >= 2 else None
        state = parts[2] if len(parts) >= 3 else None
        country = parts[3] if len(parts) >= 4 else None

        coordinates = await geocode_location(
            name,
            district,
            state,
            country,
        )

        if coordinates:
            weather = await get_weather(
                coordinates["latitude"],
                coordinates["longitude"],
            )

            return {
                "location": {
                    "name": coordinates.get("name"),
                    "district": coordinates.get("admin2"),
                    "state": coordinates.get("admin1"),
                    "country": coordinates.get("country"),
                    "country_code": coordinates.get(
                        "country_code"
                    ),
                    "latitude": coordinates.get(
                        "latitude"
                    ),
                    "longitude": coordinates.get(
                        "longitude"
                    ),
                    "timezone": coordinates.get(
                        "timezone"
                    ),
                },

                "search": {
                    "query": query,
                    "type": "location",
                },

                "current": weather.get("current"),
                "current_units": weather.get(
                    "current_units"
                ),

                "hourly": weather.get("hourly"),
                "hourly_units": weather.get(
                    "hourly_units"
                ),

                "daily": weather.get("daily"),
                "daily_units": weather.get(
                    "daily_units"
                ),

                "timezone": weather.get("timezone"),
            }

    # ---------------------------------------------------------
    # Normal city / locality / country search
    # ---------------------------------------------------------

    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"Could not find location: {query}",
        )

    # ---------------------------------------------------------
    # Choose the best result.
    #
    # Prefer India if the search result contains India,
    # otherwise use the first result.
    # ---------------------------------------------------------

    india_results = [
        location
        for location in results
        if location.get("country_code") == "IN"
    ]

    if india_results:
        location = india_results[0]
    else:
        location = results[0]

    latitude = location.get("latitude")
    longitude = location.get("longitude")

    if latitude is None or longitude is None:
        raise HTTPException(
            status_code=404,
            detail="Location coordinates are unavailable.",
        )

    weather = await get_weather(
        latitude,
        longitude,
    )

    return {
        "location": {
            "name": location.get("name"),
            "district": location.get("admin2"),
            "state": location.get("admin1"),
            "country": location.get("country"),
            "country_code": location.get(
                "country_code"
            ),
            "latitude": latitude,
            "longitude": longitude,
            "timezone": location.get(
                "timezone"
            ),
        },

        "search": {
            "query": query,
            "type": "location",
        },

        "current": weather.get("current"),
        "current_units": weather.get("current_units"),

        "hourly": weather.get("hourly"),
        "hourly_units": weather.get("hourly_units"),

        "daily": weather.get("daily"),
        "daily_units": weather.get("daily_units"),

        "timezone": weather.get("timezone"),
    }