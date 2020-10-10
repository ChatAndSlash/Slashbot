"use strict";

require('module-alias/register');
require('./globals');

const git = require('git-rev-sync');

if ( ! ['dev', 'test'].includes(process.env.MODE)) {
  const Raven = require('raven');
  Raven.config(process.env.SENTRY_URL, {
    captureUnhandledRejections: true,
    release: git.long(),
  }).install();
}

const fs       = require('fs');
const Log      = require('@util/log');
const Slashbot = require('@app/slashbot');

// Load all content files first, this prevents weird chain req issues later
Log.info('Loading content files...');
fs.readdirSync(__dirname + '/_app/content').forEach((file) => {
  if (_.endsWith(file, '.js')) {
    require(`@app/content/${file.replace('.js', '')}`);
  }
});
Log.info('Content files loaded.');

const slashbot = new Slashbot(process.env.MQ_URL);

if ('dev' === process.env.MODE) {
  process.on('unhandledRejection', (reason, p) => {
    Log.error('* * * * * UNHANDLED REJECTION!!! * * * * *');
    throw reason;
  });
  process.on('uncaughtException', (reason, p) => {
    Log.error('* * * * * UNCAUGHT EXCEPTION!!! * * * * *');
    Log.error(reason);
    process.exit(1);
  });

  slashbot.connect();
}
// On testing or production server, delay 10s so we don't flood Sentry with reconnect errors
else {
  Log.info('10s delay starting now.');
  setTimeout(slashbot.connect.bind(slashbot), 10000);
}