"use strict";

module.exports = 'test' === process.env.NODE_ENV
  ? require('bunyan-blackhole')()
  : require('bunyan').createLogger({ name: 'slashbot', level: process.env.LOG_LEVEL });