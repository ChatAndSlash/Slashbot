"use strict";

const Item = require("@app/content/items").Item;

/**
 * Boost item parent class.
 */
class BoostItem extends Item {
  constructor(info) {
    super(info);

    this.boostType   = _.get(info, 'boostType', '');
    this.maxQuantity = _.get(info, 'maxQuantity', 1);
  }

  /**
   * Boost items are "dummy" items.  They can be bought, but should never go into your inventory.
   *
   * @param {Character} character - The character buying this item.
   * @param {integer} quantity - The quantity of items being bought.
   */
  doBuyActions(character, quantity) {
    character.inventory.remove(this.type, quantity);
    character.addBoost(this.boostType);
  }

  /**
   * Prevent characters from buying this boost if they already have it active.
   *
   * @param {Character} character - The character looking to buy the item.
   * @param {integer} quantity - The quantity of this item to purchase.
   *
   * @return {boolean}
   */
  canBePurchasedBy(character, quantity = 1) {
    return ! character.hasBoost(this.boostType) && super.canBePurchasedBy(character, quantity);
  }

  /**
   * Gets the warning to display when attempting to purchase an item you cannot afford.
   *
   * @param {Character} character - The character doing the purchasing.
   * @param {integer} quantity - The quantity of the item attempted to purchase.
   * @param {string} displayName - The name of the item being purchased.
   */
  getCannotPurchaseError(character, quantity, displayName) {
    if (character.hasBoost(this.boostType)) {
      return `:warning: You cannot have more than one ${displayName} active at a time.`;
    }

    return super.getCannotPurchaseError(character, quantity, displayName);
  }
}

module.exports = {
  BoostItem
};
