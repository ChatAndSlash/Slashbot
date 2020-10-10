"use strict";

const mix       = require('mixwith').mix;
const ScaleCost = require('@mixins/item/scale_cost').ScaleCost;
const BoostItem = require('@app/content/items/boost').BoostItem;

class MaxApBoostItem extends mix(BoostItem).with(ScaleCost(25)) {
  constructor() {
    super({
      type: 'boost-max_ap',
      boostType: 'max_ap',
      displayName: __('Maximum AP Boost'),
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
    return __("Gain +2 Max AP for 30 days.");
  }

  /**
   * Add Max AP boost.
   *
   * @param {Character} character - The character buying this item.
   * @param {integer} quantity - The quantity of items being bought.
   */
  doBuyActions(character, quantity) {
    super.doBuyActions(character, quantity);
    character.ap += 2;
  }
}

module.exports = MaxApBoostItem;