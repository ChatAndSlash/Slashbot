"use strict";

const BoostItem = require('@app/content/items/boost').BoostItem;

class WatermoonRumbleBoostItem extends BoostItem {
  constructor() {
    super({
      type: 'boost-watermoon-rumble',
      boostType: 'watermoon-rumble',
      displayName: __('Rumble District Boost'),
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
    return __("Fight fewer goons in the Rumble District for 7 days.");
  }
}

module.exports = WatermoonRumbleBoostItem;