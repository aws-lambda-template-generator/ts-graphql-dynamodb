import { Field, InputType } from 'type-graphql';
import { Cast } from '../Cast';
import { Quote } from '../Quote';

@InputType('MovieInput')
export class MovieInput  {
  @Field()
  id?: string;
  
  @Field()
  year: number;

  @Field()
  title: string;

  @Field()
  country: string;

  @Field()
  director: string;

  @Field(_type => [String])
  genra: string[];

  @Field(_type => [Cast])
  cast: Cast[];

  @Field()
  description: string;

  @Field()
  whyShouldWeWatch: string;

  @Field(_type => [Quote])
  quotes: Quote[];

  @Field()
  language: string;
}
