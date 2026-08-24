import httpx


PINCODE_API_URL = "https://api.postalpincode.in/pincode"


async def search_pincode(pincode: str):
    pincode = pincode.strip()

    if not pincode.isdigit() or len(pincode) != 6:
        raise ValueError("Invalid Indian PIN code.")

    url = f"{PINCODE_API_URL}/{pincode}"

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url)
        response.raise_for_status()

        data = response.json()

    if not data:
        return None

    result = data[0]

    if result.get("Status") != "Success":
        return None

    post_offices = result.get("PostOffice") or []

    return {
        "pincode": pincode,
        "message": result.get("Message"),
        "post_offices": post_offices,
    }