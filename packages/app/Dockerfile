FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./

RUN pnpm install 

COPY . .

EXPOSE 5000

CMD ["pnpm", "start"]