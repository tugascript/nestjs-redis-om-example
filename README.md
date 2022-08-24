# NestJS RedisOM Example

This is a basic example of using [RedisOM](https://github.com/redis/redis-om-node) with NestJS from
this [article](https://dev.to/tugascript/how-to-use-redisom-with-nestjs-3oi4-temp-slug-1061296?preview=6df0685af95e4d76ddecf98feb245f1072356207b3baab3a5e549594273dae690aa0890fc1417ebc9deee07ae0f26bfe43893999667ec1e354d43f0b)
.

## Description

This is a basic Todo App with very simple JWT authentication.

## Set Up

Create an .env file with the following contents for example:

```dotenv
NODE_ENV='testing'
PORT=5000
REDIS_URL='redis://localhost:6379'
ACCESS_SECRET='Nv5UXV@7$]fV-k56T,Qj(nWPx/jXZ]Uf#4eng896'
ACCESS_TIME=86400
```

### Before running the app

For Mac Users:

```bash
~ sudo docker-compose up
```

For Linux Users (with podman):

```bash
~ podman-compose up
```

### Running the App

```bash
~ yarn install
~ yarn start:dev
```

This example app is [MIT licensed](LICENSE).
