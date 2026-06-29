FROM node:20-bullseye-slim

RUN apt-get update --fix-missing && \
    apt-get install -y --no-install-recommends \
    git ffmpeg imagemagick webp curl openssh-client && \
    rm -rf /var/lib/apt/lists/*

RUN git config --global url."https://".insteadOf ssh://

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN mkdir -p session

EXPOSE 8000

CMD ["node", "index.js"]
