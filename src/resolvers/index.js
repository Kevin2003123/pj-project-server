const User = require('./User');
const Query = require('./Query');
const Mutation = require('./Mutation');
const Image = require('./Image');
const resolvers = {
  Query,
  Mutation,
  User,
  Image
};

module.exports = resolvers;
