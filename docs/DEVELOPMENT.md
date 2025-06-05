## Prerequisites
- Node.js (version 18 or higher recommended, 20+ supported)
- pnpm (package manager). Install globally with `npm install -g pnpm`
- MongoDB
- AWS Account

### Clone and run the project locally
   ```
   git clone https://github.com/TeamShiksha/openlogo.git
   cd openlogo
   pnpm install
   pnpm start
   ```

## Environment variables

Most of the environment variables can be used by copying them from the `.env.example` file. However, if you are trying to run the business APIs locally, you will need some additional environment variables associated with AWS.

- Create a stack using `cloudformation_dev_test.yml` file given inside `app/aws` directory.
- You can generate the private and public RSA key by following the instructions given [here](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html).
- After the stack creation is successful you can find most environmental variables under the `Output` section which are mentioned below:
   - `BUCKET_NAME`
   - `BUCKET_REGION`
   - `KEY`
   - `DISTRIBUTION_DOMAIN`
   - `CLOUD_FRONT_KEYPAIR_ID`
   - `ACCESS_KEY`
   - `SECRET_ACCESS_KEY`

    **NOTE**: These values will be comma seperated.

## Running latest code using docker

On every merge we pushed the latest code to docker hub. 
- [Stage](https://hub.docker.com/u/aps08dev)
- [Prod](https://hub.docker.com/u/aps08)

This is to allow users run the latest code quickly just by supplying the environment variables from `.env` file. You can run the latest published frontend and backend Docker images with your own environment variables:
- Pull the images
```sh
docker pull aps08dev/openlogo-backend:latest
docker pull aps08dev/openlogo-frontend:latest
```
- Run the backend container (port 5000)
```sh
docker run --env-file .env -p 5000:5000 aps08dev/openlogo-backend:latest
```
- Run the frontend container (port 3000)
```sh
docker run --env-file ./frontend.env -p 3000:3000 aps08dev/openlogo-frontend:latest
```
Make sure your .env files contain all required environment variables for each service and the `.env` is in the current directory.

## Running with Docker Compose (including MongoDB)

For local development, you can use Docker Compose to run the backend, frontend, and MongoDB together. `docker-compose.yml` is provided in the repository.

This will start:
- MongoDB (default port 27017)
- Backend (default port 5000)
- Frontend (default port 3000)

You can customize ports and environment variables in the `docker-compose.yml` and `.env` files as needed.

To stop the services, press `Ctrl+C` and run:
```sh
docker compose down
```