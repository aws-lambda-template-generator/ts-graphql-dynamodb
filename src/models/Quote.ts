import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { ObjectType, Field, InputType } from 'type-graphql';

@ObjectType()
@InputType('QuoteInput')
export class Quote {
  @attribute()
  @Field()
  quote: string;
}
