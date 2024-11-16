# Stremio AIO
A single docker image that contains both Stremio server and Stremio web, on the same port, for a setup with no CORS issues.

Run with this command:
```bash
docker run -p 8080:8080 ghcr.io/iedustu/stremio-aio:latest
```

Or with docker compose:
```yaml
name: stremio-aio

services:
  stremio-aio:
    image: ghcr.io/iedustu/stremio-aio:latest
    container_name: stremio-aio
    ports:
      - 8080:8080
```
