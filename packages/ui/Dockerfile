FROM node:20-alpine

WORKDIR /ui

COPY package*.json ./

RUN pnpm install 

COPY . .

EXPOSE 3000

CMD ["pnpm", "start"]