# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Accept VITE_BASE_URL as build argument
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

COPY packages/ui/package.json packages/ui/

RUN pnpm install --filter ui...

COPY . .


RUN echo "VITE_BASE_URL=$VITE_BASE_URL" > packages/ui/.env

RUN pnpm --filter ui build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/packages/ui/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
