"use strict";

const BoostItem = require('@app/content/items/boost').BoostItem;

class WatermoonMysticBoostItem extends BoostItem {
  constructor() {
    super({
      type: 'boost-watermoon-mystic',
      boostType: 'watermoon-mystic',
      displayName: __('Mystic District Boost'),
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
    return __("Loot extra Essence Crystals in the Mystic District for 7 days.");
  }
}

module.exports = WatermoonMysticBoostItem;