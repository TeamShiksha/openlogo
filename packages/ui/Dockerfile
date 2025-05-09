# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

COPY packages/ui/package.json packages/ui/
COPY packages/ui/.env packages/ui/   

RUN pnpm install --filter ui...

COPY . .

RUN pnpm --filter ui build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/packages/ui/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
