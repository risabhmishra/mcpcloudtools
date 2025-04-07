# mcpcloudtools - Backend

docker build -t mcpcloudtools-server . 
docker run -d -p 8000:8000 --name mcpcloudtools-server mcpcloudtools-server
