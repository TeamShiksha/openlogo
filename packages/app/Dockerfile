FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package*.json ./

RUN pnpm install 

COPY . .

RUN pnpm add dotenv

EXPOSE 5000

CMD ["pnpm", "start"]