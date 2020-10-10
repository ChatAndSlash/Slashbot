"use strict";

const BoostItem = require('@app/content/items/boost').BoostItem;

class WatermoonScholarBoostItem extends BoostItem {
  constructor() {
    super({
      type: 'boost-watermoon-scholar',
      boostType: 'watermoon-scholar',
      displayName: __('Scholar District Boost'),
      gold: 5000,
    });
  }

  /**
   * Get a description of how this item will change the provided character's stats.
   *
   * @param Character character The character to evaluate against.
   *
   * @return string
   */
  getShopDescription(character) {
    return __("Loot extra Clues in the Scholar District for 7 days.");
  }
}

module.exports = WatermoonScholarBoostItem;