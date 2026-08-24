from fastapi import APIRouter, Query

from app.services.pincode_service import search_pincode
from app.services.geocoding_service import search_locations

router = APIRouter(
    prefix="/locations",
    tags=["Locations"]
)


@router.get("/search")
async def search_location(
    q: str = Query(
        ...,
        min_length=1,
        description="City, locality or Indian PIN code"
    )
):
    query = q.strip()

    # =========================================================
    # INDIAN PIN CODE
    # =========================================================

    if query.isdigit() and len(query) == 6:
        result = await search_pincode(query)

        if not result:
            return {
                "query": query,
                "type": "pincode",
                "count": 0,
                "results": []
            }

        return {
            "query": query,
            "type": "pincode",
            "count": len(result["post_offices"]),
            "results": result["post_offices"]
        }

    # =========================================================
    # CITY / LOCALITY
    # =========================================================

    # Specific West Bengal locations
    west_bengal_locations = {
        "debra": "Debra, West Bengal, India",
    }

    search_query = west_bengal_locations.get(
        query.lower(),
        query
    )

    results = await search_locations(search_query)

    # =========================================================
    # PREFER INDIAN RESULTS
    # =========================================================

    india_results = [
        location
        for location in results
        if location.get("country_code") == "IN"
    ]

    if india_results:
        results = india_results + [
            location
            for location in results
            if location.get("country_code") != "IN"
        ]

    return {
        "query": query,
        "type": "location",
        "count": len(results),
        "results": results
    }