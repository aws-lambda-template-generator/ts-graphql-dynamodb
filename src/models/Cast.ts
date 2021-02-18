import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Cast {
  @attribute()
  @Field()
  character: string;

  @attribute()
  @Field()
  actor: string;
}
