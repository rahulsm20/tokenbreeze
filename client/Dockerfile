FROM node:21-alpine AS build

WORKDIR /app

COPY package.json ./ 

RUN npm install

RUN npm install -g serve

COPY . /app

RUN npm run build

FROM node:21.6-alpine

WORKDIR /app

COPY --from=build /app /app

RUN rm -rf ./node_modules

RUN npm install --production
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "./dist", "-l", "3000"]

