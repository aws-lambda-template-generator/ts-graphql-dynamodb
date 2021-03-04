import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import mapper from '../database';
import { Movie } from '../models/Movie';

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
  async addOrUpdateMovie(@Arg('MovieInput') movie: Movie) {
   
    // Because we are using the same model for Mutation Input, Query Result and ORM,
    // id is required for graphql. However, the new entry does not have id
    // because it is created by DybamoDB automatically. 
    // Therefore, the new movie will pass 'new' as an id and remove this
    // before inserting into a table.
    if (movie.id === 'new') {
      delete movie['id'];
    }
    return await mapper.put(movie);
  }
}

export default MovieResolver;
