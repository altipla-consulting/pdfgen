
FROM node:8
MAINTAINER Ernesto Alejo <ernesto@altiplaconsulting.com>

COPY . /app
WORKDIR /app

RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

RUN npm install

# UID & GID inside the container
ARG USR_ID=0
ARG GRP_ID=0
RUN groupadd --gid $GRP_ID -r local -o && \
    useradd --system --uid=$USR_ID --gid=$GRP_ID --home-dir /home/local local -o && \
    mkdir /home/local && \
    chown local:local /home/local

USER local

RUN node index.js
