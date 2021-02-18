# TypeScript Lambda GraphQL with DynamoDb

## Tools

- yarn
- serverless
- dynamodb
- docker
- dynamodb-data-mapper
- apollo-server-lambda

## Installation

```bash
yarn install
```

## Testing lambda locally

To spin up the lambda function, we use Serverless Offline for API gateway and lambda function. We also need to start the local dynamodb container.

```bash
# start dynamodb
# First time
docker-compose up -d
# Create tables and load fixture data
yarn load-fixtures

# Once container is created and data are loaded, we can just use this command.
docker-compose start

# Start local lambda by using sls offline command
sls offline start -r ap-southeast-1 --stage test

# Test with curl
curl -X POST http://localhost:3000/test/graphql/profile --data '{"query": "{books { id author title }}"}'
```

Playground is available.

Go to `http://localhost:3000/test/graphql`. You may need to change the actual query url within the query tab to `http://localhost:3000/test/graphql/profile`

## Deploy

Rename the folder: `config_template` --> `config` and fill all the necessary information (account number and AWS regions). Make sure your AWS CLI is configured correctly. Then, use sls command to deploy.

```bash
sls deplly --stage test
# load the fixture data. table prefix is set to test_
yarn load-fixtures-remote
```

## Useful DynamoDB AWS CLI Commands

```bash
# List Table
aws dynamodb list-tables --endpoint-url http://localhost:8111

# Scan table to check the loaded data
aws dynamodb scan --endpoint-url http://localhost:8111 --table-name local_movies

# Delete unnecessary tables
aws dynamodb delete-table --endpoint-url http://localhost:8111 --table-name Music 
```


