## Troubleshooting guide

1. TypeScript error: Property 'year' has no initializer and is not definitely assigned in the constructor.

We need to add below to tsconfig.json

```json
"strictPropertyInitialization": false
```

2. Parsing error: 'import' and 'export' may appear only with 'sourceType: module'

Add sourceType in parserOptions.

```js
'parserOptions': {
  'ecmaVersion': 12,
  'sourceType': 'module'
},
```

## DynamoDB

1. About local dynamodb setup

Our local DynamoDB setup will persist the data (see https://www.mydatahack.com/how-to-persist-data-in-local-dynamodb-docker-container).

Run `docker-compose up` to start the container then try to run these command to see if the container works.

Once the local DynamoDB is up, we can just use `yarn load-fixtures` to load the data by loadFixture.ts. It uses dynamodb-data-mapper to load the data from the fixture data.

```bash
# Create tables and load fixture data
yarn load-fixtures

# List Table
aws dynamodb list-tables --endpoint-url http://localhost:8111

# Scan table to check the loaded data
aws dynamodb scan --endpoint-url http://localhost:8111 --table-name local_movies

# Delete unnecessary tables
aws dynamodb delete-table --endpoint-url http://localhost:8111 --table-name Music 
```

2. Command example to create a table with CLI

```bash
# Create Table
aws dynamodb create-table \
--endpoint-url http://localhost:8111 \
--table-name Movies \
--attribute-definitions \
    AttributeName=Artist,AttributeType=S \
    AttributeName=SongTitle,AttributeType=S \
--key-schema \
    AttributeName=Artist,KeyType=HASH \
    AttributeName=SongTitle,KeyType=RANGE \
--provisioned-throughput \
    ReadCapacityUnits=10,WriteCapacityUnits=5
```

## Reference for Library Installations

1. Using apollo-server-lambda which uses apollo-server as a base and have the wrapper to create lambda handler to convert event data into graphql query.

```bash
yarn add apollo-server-lambda graphql
# build error not found these modules, so manually installed them.
yarn add bufferutil utf-8-validate
```

2. Using dynamodb-data-mapper as ORM and aws-sdk for connecting to DynamoDb

```bash
yarn add @aws/dynamodb-data-mapper aws-sdk @aws/dynamodb-data-mapper-annotations
```

3. Using serverless-offline to spin up lambda

```bash
yarn add --dev serverless-offline
```
