FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN pnpm install 

COPY . .

EXPOSE 5000

CMD ["pnpm", "start"]