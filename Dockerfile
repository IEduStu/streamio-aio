FROM node:20-alpine as stremio-web

RUN apk add --no-cache git

WORKDIR /stremio-web

ARG WEB_GIT_REPO="https://github.com/Stremio/stremio-web.git"
ARG WEB_GIT_BRANCH="development"
RUN git clone --single-branch --depth 1 --branch "$WEB_GIT_BRANCH" "$WEB_GIT_REPO" .

RUN npm ci
RUN npm run build


FROM stremio/server:latest as stremio-server

COPY --from=stremio-web /stremio-web/build /stremio-web

LABEL version=${VERSION}

ENV NO_CORS=1

RUN mkdir -p /stremio-aio
WORKDIR /stremio-aio
COPY . .
RUN npm ci

EXPOSE 8080
ENTRYPOINT [ "node", "index.js" ]
