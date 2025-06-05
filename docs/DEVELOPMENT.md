# OpenLogo Development Documentation

## Docker Quickstart 🐳

This section will explain how you can quickly use this image with `Docker` or `Docker-compose`

### Prerequisites

Before you can use either `Docker` or `Docker-compose`, please ensure you do have the following prerequisites met.

1. **Docker** installed - [link](https://docs.docker.com/get-docker/)
2. **Docker-composed** installed (if using Docker-compose) - [link](https://docs.docker.com/compose/install/)

### Docker

If docker is installed you can build an image and run this as a container.

- Build Frontend:

   ```bash
   docker build -t openlogo-react ./packages/ui 
   ```

- Run Frontend:

   ```bash
   docker run -d -p 8080:80 --env-file ./packages/ui/.env openlogo-react
   ```

- Build Backend:

   ```bash
   docker build -t openlogo-express ./packages/app
   ```

- Run Backend:
   ```bash
   docker run -d -p 5000:5000 --env-file ./packages/app/.env openlogo-express
   ```

### Using `docker-compose`

You can use the `docker-compose.yml` using file this single command:

```bash
docker-compose up --build
```

