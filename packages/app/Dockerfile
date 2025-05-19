FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json ./

RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm install --prod && \
    pnpm store prune && \
    rm -rf ~/.pnpm-store /root/.cache /root/.local

COPY . .

EXPOSE 5000

CMD ["pnpm", "serve"]
