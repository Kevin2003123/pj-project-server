const { GraphQLServer } = require('graphql-yoga');
const knex = require('./db');
const resolvers = require('./resolvers/index');

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return { knex, request };
  }
});

server.start({ port: process.env.PORT || 4000 }, () => {
  console.log('The server is up');
});
