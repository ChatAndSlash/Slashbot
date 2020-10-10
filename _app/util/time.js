"use strict";

const moment = require('moment');

/**
 * Idenfity if the current day is a weekend day.
 *
 * @return {boolean}
 */
module.exports.isWeekend = () => {
  return ['Saturday', 'Sunday'].includes(moment().format('dddd'));
};