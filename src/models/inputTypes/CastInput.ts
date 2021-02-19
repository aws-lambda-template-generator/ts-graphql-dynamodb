import { InputType, Field } from 'type-graphql';

@InputType()
export class CastInput {
  @Field()
  character: string;

  @Field()
  actor: string;
}
