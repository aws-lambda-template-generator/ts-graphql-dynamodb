import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Quote {
  @attribute()
  @Field()
  quote: string;
}
