"use strict";

const CatalystItem = require('@app/content/items/catalyst').CatalystItem;

class MoondropCatalyst extends CatalystItem {
  constructor() {
    super({
      type: 'catalyst-moondrop',
      displayName: __('Moondrop'),
      description: __("A ray of moonlight, coalesced into a teardrop shape.  Nobody knows how these are formed, but the alchemical power they contain is immense."),
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
    return __('The primary ingredient for making flasks in Watermoon.');
  }

  /**
   * Get the cost to purchase this item.
   *
   * @param {Character} character - The character looking to buy this item.
   *
   * @return {integer}
   */
  getCost(character) {
    return Math.ceil((character.level / 15) * 1000);
  }
}

module.exports = MoondropCatalyst;