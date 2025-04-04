from fastapi import FastAPI
from routes.dynamic_routes import router
from fastapi_mcp import add_mcp_server

app = FastAPI()

# Register routers
app.include_router(router)

# Mount the MCP server to your app
add_mcp_server(
    app,  # Your FastAPI app
    mount_path="/mcp",  # Where to mount the MCP server
    name="MCP Cloud Tools",  # Name for the MCP server
)


@app.get("/")
def home():
    return {"message": "Welcome to the Dynamic API Proxy"}
