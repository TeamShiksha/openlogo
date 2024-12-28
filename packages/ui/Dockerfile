FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /ui

COPY package*.json ./

RUN pnpm install 

COPY . .

RUN pnpm add -D vite @vitejs/plugin-react

EXPOSE 3000

CMD ["pnpm", "start"]