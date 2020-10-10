"use strict";

const mix       = require('mixwith').mix;
const Item      = require('@app/content/items').Item;
const ScaleCost = require('@mixins/item/scale_cost').ScaleCost;

class BlessedKey extends mix(Item).with(ScaleCost(2)) {
  constructor() {
    super({
      type: 'blessed_key',
      displayName: __('Blessed Key'),
      description: __("A soft white glow suffuses this key, and just holding it makes you feel better."),
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
    return __("Unlock a Cursed Chest without suffering any consequences.");
  }
}

module.exports = BlessedKey;