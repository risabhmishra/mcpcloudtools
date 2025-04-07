from pydantic import BaseModel


class ToolInput(BaseModel):
    curl: str
    tool_name: str
    description: str