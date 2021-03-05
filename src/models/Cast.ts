import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { ObjectType, Field, InputType } from 'type-graphql';

@ObjectType()
@InputType('CastInput')
export class Cast {
  @attribute()
  @Field()
  character: string;

  @attribute()
  @Field()
  actor: string;
}
