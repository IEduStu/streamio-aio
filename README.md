# Streamio AIO
A single docker image that contains both Stremio server and Stremio web, on the same port, for a setup with no CORS issues.

Run with this command:
```bash
docker run -p 8080:8080 ghcr.io/iedustu/streamio-aio:latest
```

OR with docker compose:
```yaml
name: streamio-aio

services:
  streamio-aio:
    image: ghcr.io/iedustu/streamio-aio:latest
    container_name: streamio-aio
    ports:
      - 8080:8080
```
