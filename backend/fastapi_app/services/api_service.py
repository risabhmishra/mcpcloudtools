import httpx
import json
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)


async def make_request(method: str, url: str, headers=None, auth=None, query_params=None, body=None):
    """Handles external HTTP requests asynchronously using httpx."""
    try:
        async with httpx.AsyncClient() as client:
            auth_tuple = None
            if auth and auth.get("type") == "basic":
                auth_tuple = (auth["username"], auth["password"])

            response = await client.request(
                method=method.upper(),
                url=url,
                headers=headers,
                params=query_params,
                json=body,
                auth=auth_tuple,
                timeout=10.0
            )
            return {"status_code": response.status_code, "data": response.json()}

    except httpx.RequestError as e:
        logger.error(f"Request Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to connect to external API")

    except json.JSONDecodeError:
        return {"status_code": response.status_code, "data": response.text}
