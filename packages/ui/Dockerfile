# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./


# Accept build arg
ARG VITE_BASE_URL=http://localhost:5000
ENV VITE_BASE_URL=$VITE_BASE_URL

RUN pnpm install

COPY . .

RUN pnpm build # --filter ui

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
