from fastapi import FastAPI, Request
from mcp.server.fastmcp import FastMCP
from mcp.server.sse import SseServerTransport
from fastapi.middleware.cors import CORSMiddleware

import logging

from fastapi_app.tool_builder import ToolBuilder
from fastapi_app.tool_input import ToolInput

logger = logging.getLogger(__name__)

app = FastAPI(root_path="/api")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
mcp = FastMCP("MCPCloudTools")
transport = SseServerTransport("/messages/")

# In-memory registry (optional)
registered_tools = {}


@app.get("/")
def read_root():
    return {"Hello": "World"}


# @app.get("/", response_class=HTMLResponse)
# async def read_index(request: Request):
#     return templates.TemplateResponse("index.html", {"request": request})


@mcp.tool()
def calculate_bmi(weight_kg: float, height_m: float) -> float:
    """Calculate BMI given weight in kg and height in meters"""
    return weight_kg / (height_m**2)


@app.post("/register_tool")
async def register_tool(req: ToolInput):
    try:
        builder = ToolBuilder(req)
        tool_func, meta = builder.build()

        mcp.tool()(tool_func)
        registered_tools[req.tool_name] = meta

        return {
            "message": f"Tool `{req.tool_name}` registered successfully!",
            "metadata": meta,
        }

    except Exception as e:
        return {"error": str(e)}


@app.get("/tools", summary="List all registered tools")
async def list_registered_tools():
    if not registered_tools:
        return {"message": "No tools registered yet."}

    return {
        "tools": [
            {"name": name, "details": meta} for name, meta in registered_tools.items()
        ]
    }


@app.get("/sse")
async def handle_sse(request: Request):
    async with transport.connect_sse(
        request.scope, request.receive, request._send
    ) as streams:
        await mcp._mcp_server.run(
            streams[0], streams[1], mcp._mcp_server.create_initialization_options()
        )


@app.post("/messages")
async def handle_post_message(request: Request):
    # Correctly passing receive and send
    receive = request.receive
    send = request._send  # This accesses the `send` method from the request object
    return await transport.handle_post_message(request.scope, receive, send)
