from fastapi_app.tool_input import ToolInput
from fastapi_app.utils import curl_to_dict
import httpx


class ToolBuilder:
    def __init__(self, tool_input: ToolInput):
        self.tool_input = tool_input
        self.parsed = curl_to_dict(tool_input.curl)
        self.method = self.parsed["method"].lower()
        self.url = self.parsed["url"]
        self.headers = self.parsed.get("headers", {})
        self.data = self.parsed.get("data", None)

    def build(self):
        """Builds the async callable tool function."""

        async def tool_func() -> str:
            """Dynamic tool from curl"""
            async with httpx.AsyncClient() as client:
                request_func = getattr(client, self.method)
                kwargs = {"headers": self.headers}
                if self.data:
                    kwargs["data"] = self.data
                response = await request_func(self.url, **kwargs)
                return response.text

        # Attach name and docstring
        tool_func.__name__ = self.tool_input.tool_name
        tool_func.__doc__ = self.tool_input.description

        return tool_func, {
            "method": self.method,
            "url": self.url,
            "headers": self.headers,
            "data": self.data,
        }
