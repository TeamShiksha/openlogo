FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./

RUN pnpm install 

COPY aws ./aws
COPY controllers ./controllers
COPY middlewares ./middlewares
COPY models ./models
COPY repositories ./repositories
COPY routes ./routes
COPY services ./services
COPY utils ./utils
COPY index.js ./
COPY newrelic.js ./

EXPOSE 5000

CMD ["pnpm", "start"]