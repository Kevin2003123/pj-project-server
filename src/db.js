const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'bwx7iuoxpmhsuuwndwor-mysql.services.clever-cloud.com',
    user: 'uzysjzmh36jjifqq',
    password: 'WmkAEt38OMDUw5Z8vm7k',
    database: 'bwx7iuoxpmhsuuwndwor',
    port: 3306
  }
});

module.exports = knex;
