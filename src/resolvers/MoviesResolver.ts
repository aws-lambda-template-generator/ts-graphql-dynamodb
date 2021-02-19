import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import mapper from '../database';
import { Movie } from '../models/Movie';
import { MovieInput } from '../models/inputTypes/MovieInput';

@Resolver(_of => Movie)
class MovieResolver {
  @Query(_returns => [Movie])
  async movies() {
    const Movies = [];
    for await (const movie of mapper.scan(Movie)) {
      Movies.push(movie);
    }
    return Movies;
  }

  @Query(_returns => Movie)
  async movieById(@Arg('id') id: string) {
    for await (const movie of mapper.query(Movie, { id })) {
      return movie;
    }
  }

  @Query(_returns => Movie)
  async movieByIdAndYear(@Arg('id') id: string, @Arg('year') year: number) {
    mapper.get(Object.assign(new Movie, { id, year }))
      .then(item => item);
  }

  @Mutation(_returns => Movie)
  async removeMovie(@Arg('id') id: string, @Arg('year') year: number) {
    return await mapper.delete(Object.assign(
      new Movie, { id, year }
    ), { returnValues: 'ALL_OLD'});
  }

  @Mutation(_returns => Movie)
  async createMovie(@Arg('movie') movie: MovieInput) {
    mapper.put(Object.assign(new Movie, movie))
      .then(movie => movie);
  }

  @Mutation(_returns => Movie)
  async updateMovie(@Arg('movie') movie: MovieInput) {
    mapper.update(Object.assign(new Movie, movie))
      .then(movie => movie);
  }
}

export default MovieResolver;
