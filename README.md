# NexaCode NestJs Template

## Description
* Nexacode NestJs template
* 

# .env database 
```
ENVIRONMENT=dev # dev or prod
PORT=3000

DATABASE_HOST=DATABASE_HOST
DATABASE_PORT=DATABASE_PORT
DATABASE_USERNAME=DATABASE_USERNAME
DATABASE_PASSWORD=DATABASE_PASSWORD
DATABASE_DATABASE=DATABASE_DATABASE
# true logging
DATABASE_LOGGING=DATABASE_LOGGING

TOKEN_SECRET_KEY=TOKEN_SECRET_KEY
ACCESS_TOKEN_EXPIRE_SECOND=EXPIRE_SECOND
REFRESH_TOKEN_EXPIRE_SECOND=EXPIRE_SECOND

MAIL_HOST=MAIL_HOST
MAIL_PORT=MAIL_PORT
MAIL_AUTH_ID=MAIL_ID
MAIL_AUTH_PASSWORD=MAIL_PASSWORD
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Architecture
