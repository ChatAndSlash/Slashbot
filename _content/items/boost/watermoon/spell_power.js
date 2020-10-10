"use strict";

const BoostItem = require('@app/content/items/boost').BoostItem;

class WatermoonSpellPowerBoostItem extends BoostItem {
  constructor() {
    super({
      type: 'boost-watermoon-spell_power',
      boostType: 'watermoon-spell_power',
      displayName: __('Spell Power Boost'),
      gold: 2500,
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
    return __("Gain 25% Spell Power while in Watermoon for 7 days.");
  }
}

module.exports = WatermoonSpellPowerBoostItem;