FROM node:18-alpine as builder

RUN mkdir /app

COPY package*.json ./app

COPY . /app

WORKDIR /app

RUN npm install --legacy-peer-deps

RUN npm run build

CMD [ "npm", "run", "start:dev" ]
