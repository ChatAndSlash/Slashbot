"use strict";

const fs = require('fs');
const promisify = require('util').promisify;

/**
 * Clean a database before running a test.
 *
 * @param {function} done - The function to run when done.
 */
global.cleanDatabase = async function() {
  const DatabaseCleaner = require('database-cleaner');
  const databaseCleaner = new DatabaseCleaner('mysql');
  const mysql = require('mysql');
  const connection = new mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB
  });

  const asyncClean = promisify(databaseCleaner.clean).bind(databaseCleaner);
  await asyncClean(connection);

  connection.end();
};

// Load all content files first, this prevents weird chain require issues later
fs.readdirSync(__dirname + '/_app/content').forEach((file) => {
  if (_.endsWith(file, '.js')) {
    require(`@app/content/${file.replace('.js', '')}`);
  }
});

// Only run the following once
if (_.isUndefined(global, 'firstRunComplete')) {
  // If any promise rejections aren't properly handled, throw as errors
  process.on('unhandledRejection', (reason, p) => {
    throw reason;
  });

  global.firstRunComplete = true;
}