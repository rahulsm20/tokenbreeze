# Cron

This is a cron job for caching token prices for Tokenbreeze

## Tech Stack

- Bun
- Typescript
- Cron
- GraphQL
- Redis
- Docker

## Steps to run

- Set up env variables as per
  [.env.example](./.env.example)

- Dev mode

  ```bash
  bun dev
  ```

- Production mode

  ```bash
  bun build && bun start
  ```
