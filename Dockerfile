FROM node:20-bullseye-slim

RUN apt-get update && \
    apt-get install -y git ffmpeg imagemagick webp python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./

RUN npm install --legacy-peer-deps

COPY . .

ENV PORT=8000
EXPOSE 8000

CMD ["node", "index.js"]
