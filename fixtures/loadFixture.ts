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

// Before loading the fixture, we delete the table if exists
mapper.ensureTableNotExists(Movies)
  .then(() => {
    mapper.ensureTableExists(Movies, {readCapacityUnits: 5, writeCapacityUnits: 5 })
    .then(async() => {
      // eslint-disable-next-line no-unused-vars
      for await (const persisted of mapper.batchPut(fixtures)) {
        console.log('fixture loaded');
      }
    });
  })
