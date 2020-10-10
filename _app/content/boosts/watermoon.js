"use strict";

const Boost  = require("@app/content/boosts").Boost;
const moment = require('moment');

/**
 * Watermoon boosts parent class.
 */
class WatermoonBoost extends Boost {
  /**
   * If the character is currently in Watermoon.
   *
   * @param {Character} character - The character to check.
   *
   * @return boolean
   */
  isInWatermoon(character) {
    return character.location.type.substring(0, 9) === 'watermoon';
  }

  /**
   * Get the time remaining on this boost.
   *
   * @return {timestamp}
   */
  getTimeRemaining() {
    const purchasedDate = moment(this.purchasedAt);
    return moment(purchasedDate).add(7, 'days').add(1, 'hour');
  }
}

module.exports = {
  WatermoonBoost
};