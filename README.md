# TypeScript Lambda GraphQL with DynamoDb

# In Progress...

## Installation

```bash
yarn add apollo-server-lambda graphql

# build error not found these modules, so manually installed them.
yarn add bufferutil utf-8-validate
```

*Tools*

## Testing lambda locally

Use Serverless Offline.

```bash
# Install
yarn add --dev serverless-offline

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
```

## Local DynamoDB

Our local DynamoDB setup will persist the data (see https://www.mydatahack.com/how-to-persist-data-in-local-dynamodb-docker-container).

Run `docker-compose up` to start the container then try to run these command to see if the container works.

```bash
# Create Table
aws dynamodb create-table \
--endpoint-url http://localhost:8111 \
--table-name Music \
--attribute-definitions \
    AttributeName=Artist,AttributeType=S \
    AttributeName=SongTitle,AttributeType=S \
--key-schema \
    AttributeName=Artist,KeyType=HASH \
    AttributeName=SongTitle,KeyType=RANGE \
--provisioned-throughput \
    ReadCapacityUnits=10,WriteCapacityUnits=5

# List Table
aws dynamodb list-tables --endpoint-url http://localhost:8111
```
