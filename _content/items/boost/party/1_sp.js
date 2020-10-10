"use strict";

const { mix }       = require('mixwith');
const { ScaleCost } = require('@mixins/item/scale_cost');
const { PartyBoostItem } = require('@app/content/items/boosts/party');

class PartyOneSpBoostItem extends mix(PartyBoostItem).with(ScaleCost(100)) {
  constructor() {
    super({
      type: 'boost-party-1_sp',
      boostType: 'party-1_sp',
      displayName: 'Party +1 SP Boost',
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
    return "Party gains +1 SP per fight won for 30 days.";
  }
}

module.exports = PartyOneSpBoostItem;