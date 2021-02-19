import { Field, ID, InputType } from 'type-graphql';
import { CastInput } from './CastInput';
import { QuoteInput } from './QuoteInput';

@InputType()
export class MovieInput {
  @Field()
  id?: string;

  @Field()
  title: string;

  @Field()
  year: number;

  @Field()
  country: string;

  @Field()
  director: string;

  @Field(_type => [String])
  genra: string[];

  @Field(_type => [CastInput])
  cast: CastInput[];

  @Field()
  description: string;

  @Field()
  whyShouldWeWatch: string;

  @Field(_type => [QuoteInput])
  quotes: QuoteInput[];

  @Field()
  language: string;
}
