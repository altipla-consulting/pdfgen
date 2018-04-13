
FROM node:9
MAINTAINER Ernesto Alejo <ernesto@altiplaconsulting.com>

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
WORKDIR /app

RUN npm install

COPY index.js /app/index.js

ENV DEBUG=*

CMD ["node", "index.js"]
