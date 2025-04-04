from fastapi import Request, HTTPException
from fastapi.routing import APIRoute
from fastapi_app.models.api_request import APIRequest
from fastapi_app.services.api_service import make_request
import logging

logger = logging.getLogger(__name__)


class DynamicRouteController:
    """Manages dynamic API routes at runtime."""
    dynamic_routes = {}

    @classmethod
    def create_dynamic_route(cls, app, data: APIRequest):
        """Dynamically adds an endpoint to FastAPI at runtime."""
        if data.endpoint in cls.dynamic_routes:
            raise HTTPException(status_code=400, detail="Endpoint already exists.")

        async def dynamic_proxy(request: Request):
            """Handles all HTTP methods dynamically."""
            request_body = await request.json() if request.method in ["POST", "PUT", "PATCH"] else None
            response = await make_request(
                method=request.method,
                url=data.url,
                headers={**request.headers, **(data.headers or {})},
                auth=data.auth,
                query_params=dict(request.query_params),
                body=request_body
            )
            return response

        # Add new route dynamically
        app.add_api_route(data.endpoint, dynamic_proxy, methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
        cls.dynamic_routes[data.endpoint] = data.url
        logger.info(f"Added new route: {data.endpoint} -> {data.url}")

    @classmethod
    def remove_dynamic_route(cls, app, endpoint: str):
        """Removes a dynamic route at runtime."""
        if endpoint not in cls.dynamic_routes:
            raise HTTPException(status_code=404, detail="Endpoint not found.")

        for route in app.routes:
            if isinstance(route, APIRoute) and route.path == endpoint:
                app.routes.remove(route)
                break

        del cls.dynamic_routes[endpoint]
        logger.info(f"Removed route: {endpoint}")
