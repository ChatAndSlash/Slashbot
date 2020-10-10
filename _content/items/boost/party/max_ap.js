"use strict";

const { mix }       = require('mixwith');
const { ScaleCost } = require('@mixins/item/scale_cost');
const { PartyBoostItem } = require('@app/content/items/boosts/party');

class PartyMaxApBoostItem extends mix(PartyBoostItem).with(ScaleCost(100)) {
  constructor() {
    super({
      type: 'boost-party-max_ap',
      boostType: 'party-max_ap',
      displayName: 'Party Maximum AP Boost',
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
    return "Party gains +3 Max AP for 30 days.";
  }

  /**
   * Add Max AP boost.
   *
   * @param {Character} character - The character buying this item.
   * @param {integer} quantity - The quantity of items being bought.
   */
  doBuyActions(character, quantity) {
    super.doBuyActions(character, quantity);
    character.ap += 3;
  }
}

module.exports = PartyMaxApBoostItem;