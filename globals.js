"use strict";

// Load correct environment file
require('dotenv').config({ path: 'test' === process.env.NODE_ENV ? '.env-test' : '.env' });

global.CONTENT_FILES_PATH = __dirname + '/_content';

global._ = require('lodash');

// Can't believe this isn't defined already
global._.mixin({
  isDefined: (value) => {
    return ! _.isUndefined(value);
  }
});

// Internationalization engine is in global scope
require("i18n").configure({
  locales: ['en', 'fr'],
  directory: __dirname + '/locales',
  register: global,
});

// MySQL pooled connections
(async () => {
  global.DB_POOL = await require('mysql2/promise').createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DB,
    multipleStatements: true,
    charset: 'utf8mb4',
    connectionLimit: 100,
    queueLimit: 100,
  });
})();