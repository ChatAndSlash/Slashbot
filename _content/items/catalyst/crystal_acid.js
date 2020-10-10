"use strict";

const CatalystItem = require('@app/content/items/catalyst').CatalystItem;

const TYPE_QUICKSALT = 'catalyst-quicksalt';

class CrystalAcidCatalyst extends CatalystItem {
  constructor() {
    super({
      type: 'catalyst-crystal_acid',
      displayName: __('Crystal Acid'),
      description: __("This tiny green crystal is what's left over when draconic acid crystalizes outside of a dragon.  While harmless to touch, it's still incredibly powerful, and useful in all sorts of alchemy."),
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
    return __('The primary ingredient for making flasks in Tyrose.');
  }

  /**
   * Get the description of the cost to purchase this item.
   *
   * @param {Character} character - The character looking to buy this item.
   *
   * @return {string}
   */
  getCostDescription(character) {
    return __("1 Quicksalt");
  }

  /**
   * If the provided character can afford this item.
   *
   * @param {Character} character - The character looking to buy the item.
   * @param {integer} quantity - The quantity of this item to purchase.
   *
   * @return {boolean}
   */
  canBePurchasedBy(character, quantity = 1) {
    return character.inventory.quantity(TYPE_QUICKSALT) >= quantity;
  }

  /**
   * Subtract the cost of this item from the provided character.
   *
   * @param {Character} character - The character buying the item.
   * @param {integer} quantity - The quantity of this item to purchase.
   */
  subtractCostFrom(character, quantity = 1) {
    character.inventory.remove(TYPE_QUICKSALT, quantity);
  }
}

module.exports = CrystalAcidCatalyst;