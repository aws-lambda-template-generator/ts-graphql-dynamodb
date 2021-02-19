import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import resolvers from './src/resolvers';

const startServer = async () => {
  const schema = await buildSchema({
    resolvers,
  });

  const server = new ApolloServer({
    schema,
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
};

startServer();
