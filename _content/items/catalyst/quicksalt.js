"use strict";

const CatalystItem = require('@app/content/items/catalyst').CatalystItem;

const TYPE_MOONDROP = 'catalyst-moondrop';

class QuicksaltCatalyst extends CatalystItem {
  constructor() {
    super({
      type: 'catalyst-quicksalt',
      displayName: __('Quicksalt'),
      description: __("Though rare, Quicksalt is prized for a variety of reasons.  Intellectuals enjoy the burst of energy it provides when ingested with food, while alchemists can harness the latent magic inside."),
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
    return __('The primary ingredient for making flasks in Scatterslide.');
  }

  /**
   * Get the description of the cost to purchase this item.
   *
   * @param {Character} character - The character looking to buy this item.
   *
   * @return {string}
   */
  getCostDescription(character) {
    return __("1 Moondrop");
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
    return character.inventory.quantity(TYPE_MOONDROP) >= quantity;
  }

  /**
   * Subtract the cost of this item from the provided character.
   *
   * @param {Character} character - The character buying the item.
   * @param {integer} quantity - The quantity of this item to purchase.
   */
  subtractCostFrom(character, quantity = 1) {
    character.inventory.remove(TYPE_MOONDROP, quantity);
  }
}

module.exports = QuicksaltCatalyst;