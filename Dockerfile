# Base project configuration
FROM node:18.4.0 as build

RUN npm i -g @nestjs/cli

COPY package*.json /.

RUN npm ci --cache .npm --prefer-offline

COPY . .

RUN npm run build

RUN npm run start:prod
