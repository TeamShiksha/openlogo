FROM node:20-alpine

WORKDIR /ui

RUN npm install -g pnpm

COPY package*.json ./

RUN pnpm install 

COPY . .

EXPOSE 3000

CMD ["pnpm", "start"]