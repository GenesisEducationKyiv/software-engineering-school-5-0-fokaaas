# Testing

This project have unit and integration tests to ensure the functionality and reliability of the code. The tests are written using the `Jest` framework.

You need to have Docker installed to run the integration tests, as they require a running PostgreSQL database and Redis.

## How to run tests

First, make sure you have the necessary dependencies installed. You can do this by running:

```bash
yarn install
```

Once the dependencies are installed, you can generate prisma client by running:

```bash
yarn prisma:generate
```

Then, you can run the unit tests using the following command:

```bash
yarn test
```

To run the integration tests, you can use the following command:

```bash
yarn itest:full
```
