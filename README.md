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

Then open port `8080` in your browser.

## Using an [mDNS](https://en.wikipedia.org/wiki/Multicast_DNS) (a `.local` domain)
If you host this docker image on a device on your network and connect to is using [mDNS](https://en.wikipedia.org/wiki/Multicast_DNS) (a `.local` domain, such as `my-device.local`), streaming may not work for you.

To fix that, make sure to pin the device's IP in your router to ensure it doesn't change, and then set a mapping between the domain you use and the device's static external IP.

This is how you do it using a `docker run` command:
```bash
docker run -p 8080:8080 --add-host my-device.local:<ip address here> ghcr.io/iedustu/stremio-aio:latest
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
    extra_hosts:
      - "my-device.local:<ip address here>"
```
