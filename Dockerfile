
FROM node:8
MAINTAINER Ernesto Alejo <ernesto@altiplaconsulting.com>

RUN apt-get update && \
    apt-get install -y wget && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install -y google-chrome-unstable

COPY . /app
WORKDIR /app

RUN npm install

RUN groupadd -r pptruser && \
    useradd -r -g pptruser -G audio,video pptruser && \
    mkdir -p /home/pptruser/Downloads && \
    mkdir -p /home/pptruser/.config && \
    chown -R pptruser:pptruser /home/pptruser && \
    chown -R pptruser:pptruser /app/node_modules

USER pptruser
CMD ["node", "index.js"]
