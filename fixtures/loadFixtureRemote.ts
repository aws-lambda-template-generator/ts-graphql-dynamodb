import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Movie } from '../src/models/Movie';
import { moviesFixture } from './moviesData';

const tablePrefix = 'test';

const mapper = new DataMapper({
  client: new DynamoDB({
    region: 'ap-southeast-2'
  }),
  // optionally, we can provide table name prefix
  tableNamePrefix: `${tablePrefix}_`
});

const fixtures: Object[]  = [];

moviesFixture.map((movie) => {
  fixtures.push(Object.assign(new Movie, movie));
});

const load = async() => {
  // eslint-disable-next-line no-unused-vars
  for await (const persisted of mapper.batchPut(fixtures)) {
    console.log('fixture loaded');
  }
};

load();
