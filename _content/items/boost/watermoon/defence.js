"use strict";

const BoostItem = require('@app/content/items/boost').BoostItem;

class WatermoonDefenceBoostItem extends BoostItem {
  constructor() {
    super({
      type: 'boost-watermoon-defence',
      boostType: 'watermoon-defence',
      displayName: __('Defence Boost'),
      gold: 2000,
    });
  }

  /**
   * Get a description of how this item will change the provided character's stats.
   *
   * @param {Character} character The character to evaluate against.
   *
   * @return string
   */
  getShopDescription(character) {
    return __("Gain 25% Defence while in Watermoon for 7 days.");
  }
}

module.exports = WatermoonDefenceBoostItem;