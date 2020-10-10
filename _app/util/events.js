const { get } = require('lodash');
const moment = require('moment');
const { sprintf } = require("sprintf-js");

const CHRISTMAS_START = '%d-12-01';
const CHRISTMAS_END = '%d-01-02'; // Up to, but not including the second

/**
 * If the Halloween event is happening.
 *
 * @return {boolean}
 */
const isHalloween = () => 'true' === get(process.env, 'EVENT_HALLOWEEN', 'false');

/**
 * If the Christmas event is happening.
 *
 * @return {boolean}
 */
const isChristmas = () => {
  const currentYear = moment().year();

  return moment().isSameOrAfter(sprintf(CHRISTMAS_START, currentYear)) // XXXX-12-01 -> XXXX-12-31
    || moment().isBefore(sprintf(CHRISTMAS_END, currentYear)); // XXXX-01-01 -> XXXX-01-01
};

/**
 * If *any* event is happening.
 *
 * @return {boolean}
 */
const isEvent = () => isHalloween() || isChristmas();

module.exports = {
  isHalloween,
  isChristmas,
  isEvent,
};