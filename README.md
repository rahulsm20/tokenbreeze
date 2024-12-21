<h1 style="display:flex; flex-direction:row; gap:1rem; align-items:center; justify-items:center;"> TokenBreeze <img src="./client/public/waves.svg"/></h1>
Just another token price aggregator.

### Index

- [Tech Stack](#architecture)
- [Architecture](#architecture)
- [Setup locally](#architecture)

### Tech Stack

- Frontend
  - React
  - TypeScript
  - GraphQL + Apollo Client
- Backend
  - Node.js + Express
  - GraphQL + Apollo Server
  - Redis
  - Docker
- Testing
  - Mocha + Chai
  - Grafana k6

### Architecture

![architecture](./client/public/tokenbreeze.png)

### Setup Locally

- Setup .env files in client and server directories based on the .env.example files

Run client

```
cd client && npm i && npm run dev
```

Run server

```
cd server && npm i && npm run dev
```

Run using Docker

```
docker compose up
```
