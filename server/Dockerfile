# syntax=docker/dockerfile:1
FROM oven/bun:1.1.13 as base

WORKDIR /app

COPY ./bun.lock /app/
COPY ./package.json /app/

RUN bun install --frozen-lockfile

COPY . /app

RUN bun run build

CMD ["bun", "start"]
