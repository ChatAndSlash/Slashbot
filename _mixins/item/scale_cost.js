"use strict";

const Text = require('@util/text');

/**
 * Costs Dragon Scales instead of gold.
 *
 * @param {string} quantity - The quantity of scales that is required as a cost.
 *
 * @return {Mixin}
 */
const ScaleCost = (quantity = 1) => {
  return (Equipment) => class extends Equipment {
    constructor(info) {
      super(info);

      this._scales = quantity;
    }

    /**
     * Get the cost to purchase this item.
     *
     * @param {Character} character - The character looking to buy this item.
     *
     * @return {integer}
     */
    getCost(character) {
      return this._scales;
    }

    /**
     * Get the description of the cost to purchase this item.
     *
     * @param {Character} character - The character looking to buy this item.
     *
     * @return {string}
     */
    getCostDescription(character) {
      return `${this._scales} Dragon ${Text.pluralize("Scale", this._scales)}`;
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
      return character.scales >= (this._scales * quantity) && super.canBePurchasedBy(character, quantity);
    }

    /**
     * Gets the warning to display when attempting to purchase an item you cannot afford.
     *
     * @param {Character} character - The character doing the purchasing.
     * @param {integer} quantity - The quantity of the item attempted to purchase.
     * @param {string} displayName - The name of the item being purchased.
     */
    getCannotPurchaseError(character, quantity, displayName) {
      if (this.maxQuantity && character.inventory.quantity(this.type) + quantity > this.maxQuantity) {
        return `:warning: You cannot have more than ${this.maxQuantity}x ${this.getDisplayName(character)}.`;
      }

      if (character.scales < (this._scales * quantity)) {
        const url = Text.getBuyUrl(character);
        return `:warning: You cannot afford ${quantity}x ${displayName}.\n\nTo get more scales, visit:\n${url}`;
      }

      return super.getCannotPurchaseError(character, quantity, displayName);
    }

    /**
     * Subtract the cost of this item from the provided character.
     *
     * @param {Character} character - The character buying the item.
     * @param {integer} quantity - The quantity of this item to purchase.
     */
    subtractCostFrom(character, quantity = 1) {
      character.scales -= (this._scales * quantity);

      character.track('Premium Purchase', {
        type: this.type,
        quantity
      });
    }
  };
};

module.exports = {
  ScaleCost
};