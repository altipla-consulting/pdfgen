
FROM node:8
MAINTAINER Ernesto Alejo <ernesto@altiplaconsulting.com>

COPY . /app
WORKDIR /app

RUN npm install

RUN node index.js
