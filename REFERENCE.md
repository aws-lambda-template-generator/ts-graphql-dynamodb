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

3. @typescript-eslint/parser loading error

Error

```
ESLint : Failed to load parser '@typescript-eslint/parser' declared in '.eslintrc.js': Cannot find module '@typescript-eslint/parser'
```

Config that giving us the error

```js
module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true
  },
  'parser': '@typescript-eslint/parser',
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'rules': {
    semi: ['error', 'always'],
    quotes: [2, 'single'],
    indent: ['error', 2]
  }
};
```

Update

```js
module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:fp/recommended',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
  ],
  env: {
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest',
    'fp',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      node: {
          extensions: ['.ts'],
          paths: ['node_modules/', 'node_modules/@types']
      },
      typescript: {},
    },
  },
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2019,
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': ['error', 'never'],
    'import/prefer-default-export': 'off',
    'radix': 'off',
    semi: ['error', 'always'],
    quotes: [2, 'single'],
    indent: ['error', 2]
  },
  overrides: [
    // Models use classes and decorators
    {
      files: ['src/entities/*.ts'],
      rules: {
        'fp/no-class': 'off',
        'fp/no-this': 'off',
        'fp/no-mutation': 'off',
        'import/no-cycle': 'off',
      },
    },
    {
      files: ['src/services/SessionService.ts'],
      rules: {
        'fp/no-mutation': ['off'],
        'fp/no-nil': ['off'],
      },
    },
  ]
};
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


# Update table with GSI
aws dynamodb update-table \
  --endpoint-url http://localhost:8111 \
  --table-name local_movies \
  --attribute-definitions AttributeName=title,AttributeType=S \
  --global-secondary-index-updates \
  "[{\"Create\":{\"IndexName\": \"MovieTitle-index\",\"KeySchema\":[{\"AttributeName\":\"title\",\"KeyType\":\"HASH\"}], \
  \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5      },\"Projection\":{\"ProjectionType\":\"ALL\"}}}]"

# Query table with GSI
 aws dynamodb query \
  --endpoint-url http://localhost:8111 \
  --table-name local_movies \
  --index-name MovieTitle-index \
  --key-condition-expression "title = :name" \
  --expression-attribute-values  '{":name":{"S":"Blade Runner"}}'

# Query table by ID (HashKey)
aws dynamodb query \
  --endpoint-url http://localhost:8111 \
  --table-name local_movies \
  --key-condition-expression "id = :id" \
  --expression-attribute-values  '{":id":{"S":"ea8663db-29e4-42bd-bf76-04b4b0e2f597"}}'
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

## Reference for dynamodb-data-mapper annotation

This is from googling, but looking at the source code, I don't think it supports GSI or LSI with annotation.

```ts
@table('items')
class Item {
  @hashKey({ // <-- this is your normal hash key (shared by table and of LSI)
    indexKeyConfigurations:{
      ItemIdIndex: 'HASH' // The key (ItemIdIndex) is the name of the index; the value is the key type ('HASH' or 'RANGE')
    }
  })
  itemId: string;

  @rangeKey() // <-- this is your normal range key (not part of LSI)
  displayName: string;

  @attribute({
    // And this other attribute acts as the LSI's RangeKey
    indexKeyConfigurations: {
      ItemIdIndex: 'RANGE'
    }
  })
  foo: string;

  @attribute()
  bar: string;
}
```

## DynamoDB data mapper trouble shoot

1. Error: The number of conditions on the keys is invalid

`GetItem` in DynamoDB needs the same number of key conditions as the number of keys. So, the method below doesn't work when table has hash and range keys.

```ts
@Query(_returns => Movie)
  async Movie(@Arg("id") id: string) {
    return await mapper.get(Object.assign(new Movie, {
      id
    }));
  }
```

So, using query method is the way to go.

```ts
@Query(_returns => Movie)
  async Movie(@Arg("id") id: string) {
    return await mapper.query(Movie, { id });
  }
```
