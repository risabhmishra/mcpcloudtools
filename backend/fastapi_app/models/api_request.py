from pydantic import BaseModel
from typing import Dict, Optional


class APIRequest(BaseModel):
    endpoint: str  # New API route (e.g., "/fetch_google")
    method: str  # HTTP method (GET, POST, PUT, DELETE, PATCH)
    url: str  # External API URL
    headers: Optional[Dict[str, str]] = None
    auth: Optional[Dict[str, str]] = None  # {"type": "basic", "username": "user", "password": "pass"}
    query_params: Optional[Dict[str, str]] = None
    body: Optional[Dict] = None  # Request body for POST/PUT
