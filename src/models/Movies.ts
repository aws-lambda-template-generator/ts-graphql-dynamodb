import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';

const tableName = 'movies';

@table(tableName)
export class Movies {
  @hashKey()
  year: number;

  @rangeKey()
  title: string;

  @attribute()
  country: string;

  @attribute()
  director: string;

  @attribute()
  genra: string[];

  @attribute()
  cast: Cast[];

  @attribute()
  description: string;

  @attribute()
  whySHouldWeWatch: string;

  @attribute()
  quotes: quote[];

  @attribute()
  language: string;
}


export interface Cast {
  character: string;
  actor: string;
}

export interface quote {
  quote: string[];
}
