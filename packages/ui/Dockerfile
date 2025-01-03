FROM node:20-alpine

WORKDIR /ui

RUN npm install -g pnpm

COPY package*.json ./

RUN pnpm install 

COPY src ./src
COPY public ./public
COPY components ./components
COPY utils ./utils
COPY vite.config.js ./
COPY index.html ./
COPY vite.config.js ./
COPY vitest.config.js ./
COPY eslint.config.js ./
COPY babel.config.mjs ./

EXPOSE 3000

CMD ["pnpm", "start"]