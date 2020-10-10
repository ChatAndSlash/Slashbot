require('dotenv').config({ path: 'test' === process.env.NODE_ENV ? '.env-test' : '.env' });

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DB,
    }
  },
  test: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'slash',
      password: 'slash',
      database: 'slashtest',
    }
  },
};
