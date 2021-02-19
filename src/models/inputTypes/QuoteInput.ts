import { InputType, Field } from 'type-graphql';

@InputType()
export class QuoteInput {
  @Field()
  quote: string;
}
