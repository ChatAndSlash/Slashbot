"use strict";

const BoostItem = require('@app/content/items/boost').BoostItem;

class WatermoonTechniqueBoostItem extends BoostItem {
  constructor() {
    super({
      type: 'boost-watermoon-technique',
      boostType: 'watermoon-technique',
      displayName: __('Technique Boost'),
      gold: 1000,
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
    return __("Gain 25% Technique while in Watermoon for 7 days.");
  }
}

module.exports = WatermoonTechniqueBoostItem;