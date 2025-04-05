from fastapi import APIRouter
from fastapi_app.models.api_request import APIRequest
from fastapi_app.controllers.dynamic_route_controller import DynamicRouteController
from fastapi_app.main import app  # Import fastapi_app instance

router = APIRouter()


@router.post("/add_route")
async def add_route(data: APIRequest):
    """Adds a new dynamic API route to proxy requests."""
    DynamicRouteController.create_dynamic_route(app, data)
    return {"status": "success", "message": f"Route {data.endpoint} added"}


@router.get("/routes")
def list_routes():
    """Lists all registered dynamic routes."""
    return {"registered_routes": list(DynamicRouteController.dynamic_routes.keys())}


@router.delete("/remove_route")
async def remove_route(endpoint: str):
    """Removes a dynamic route at runtime."""
    DynamicRouteController.remove_dynamic_route(app, endpoint)
    return {"status": "success", "message": f"Route {endpoint} removed"}
