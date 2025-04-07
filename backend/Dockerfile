FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app
COPY . .

RUN uv venv && uv pip install --upgrade pip && uv sync --frozen --no-cache


# Expose the app port
EXPOSE 8000

# Run the FastAPI app with Uvicorn
CMD ["/app/.venv/bin/uvicorn", "fastapi_app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
