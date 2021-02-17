import { Arg, Query, Resolver } from "type-graphql";
import mapper from '../database';
import { Movie } from '../models/Movie';

@Resolver(_of => Movie)
class MovieResolver {
  @Query(_returns => [Movie])
  async Movies() {
    const Movies = [];
    for await (const movie of mapper.scan(Movie)) {
      Movies.push(movie);
    }
    return Movies;
  }

  @Query(_returns => Movie)
  async Movie(@Arg("id") id: string) {
    return await mapper.get(Object.assign(new Movie, {
      id
    }));
  }
}

export default MovieResolver;