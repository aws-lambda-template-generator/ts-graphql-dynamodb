import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB from 'aws-sdk/clients/dynamodb';

const environment = process.env.LAMBDA_ENV ?? 'local';
const config = environment === 'local'
  ? { region: 'ap-southeast-2', endpoint: 'http://127.0.0.1:8111' } : { region: 'ap-southeast-2' };

const mapper = new DataMapper({
  client: new DynamoDB(config),
  tableNamePrefix: `${environment}_`
});

export default mapper;
