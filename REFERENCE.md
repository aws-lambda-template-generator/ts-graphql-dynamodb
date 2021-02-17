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


# Code Examples

Putting data into DynamoDb with batchput

```ts
import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Movies } from '../src/models/Movies';
import { moviesFixture } from './moviesData';

const localEndpoint = 'http://localhost:8111';
// eslint-disable-next-line no-undef
const tablePrefix= process.env.LAMBDA_ENV || 'local';

const mapper = new DataMapper({
  client: new DynamoDB({
    region: 'ap-southeast-2',
    endpoint: localEndpoint
  }),
  // optionally, we can provide table name prefix
  tableNamePrefix: `${tablePrefix}_`
});

const fixtures: Object[]  = [];

moviesFixture.map((movie) => {
  fixtures.push(Object.assign(new Movies, movie));
});


mapper.ensureTableExists(Movies, {readCapacityUnits: 5, writeCapacityUnits: 5 })
  .then(async() => {
    // eslint-disable-next-line no-unused-vars
    for await (const persisted of mapper.batchPut(fixtures)) {
      console.log('fixture loaded');
    }
  });
```
