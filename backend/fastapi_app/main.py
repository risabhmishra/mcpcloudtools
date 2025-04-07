from fastapi import FastAPI
from starlette.routing import Host
from mcp.server.fastmcp import FastMCP

import logging

from fastapi_app.tool_builder import ToolBuilder
from fastapi_app.tool_input import ToolInput

logger = logging.getLogger(__name__)

mcp = FastMCP("MCPCloudTools")
app = FastAPI()

# Register routers
app.routes.append(Host('mcp.acme.corp', app=mcp.sse_app()))

# In-memory registry (optional)
registered_tools = {}


@mcp.tool()
def calculate_bmi(weight_kg: float, height_m: float) -> float:
    """Calculate BMI given weight in kg and height in meters"""
    return weight_kg / (height_m ** 2)


@app.post("/register_tool")
async def register_tool(req: ToolInput):
    try:
        builder = ToolBuilder(req)
        tool_func, meta = builder.build()

        mcp.tool()(tool_func)
        registered_tools[req.tool_name] = meta

        return {
            "message": f"Tool `{req.tool_name}` registered successfully!",
            "metadata": meta
        }

    except Exception as e:
        return {"error": str(e)}


@app.get("/tools", summary="List all registered tools")
async def list_registered_tools():
    if not registered_tools:
        return {"message": "No tools registered yet."}

    return {
        "tools": [
            {
                "name": name,
                "details": meta
            }
            for name, meta in registered_tools.items()
        ]
    }
