import { NonEmptyArray } from 'type-graphql';
import MoviesResolver from './MoviesResolver';

const resolvers: NonEmptyArray<Function> = [MoviesResolver];

export default resolvers;
