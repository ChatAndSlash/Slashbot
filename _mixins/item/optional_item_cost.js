"use strict";

const Items = require('@app/content/items').Items;

/**
 * If character has an item, it can be used to purchase this item instead of the gold cost.
 *
 * @param {string} type - The type of item that is required as a cost.
 * @param {string} quantity - The quantity of the item that is required as a cost.
 *
 * @return {Mixin}
 */
const OptionalItemCost = (type, quantity) => {
  return (Equipment) => class extends Equipment {
    /**
     * Get the cost to purchase this item.
     *
     * @param {Character} character - The character looking to buy this item.
     *
     * @return {integer}
     */
    getCost(character) {
      return character.inventory.has(type, quantity) ? 0 : this.gold;
    }

    /**
     * Get the description of the cost to purchase this item.
     *
     * @param {Character} character - The character looking to buy this item.
     *
     * @return {string}
     */
    getCostDescription(character) {
      if (character.inventory.has(type, quantity)) {
        return `${quantity}x ${Items.getName(type)}`;
      }
      else {
        return `${this.gold}g`;
      }
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
      if (character.inventory.has(type, quantity)) {
        return true;
      }
      else {
        return super.canBePurchasedBy(character, quantity);
      }
    }

    /**
     * Subtract the cost of this item from the provided character.
     *
     * @param {Character} character - The character buying the item.
     * @param {integer} quantity - The quantity of this item to purchase.
     */
    subtractCostFrom(character, quantity = 1) {
      if (character.inventory.has(type, quantity)) {
        character.inventory.remove(type, quantity);
      }
      else {
        return super.subtractCostFrom(character, quantity);
      }
    }
  };
};

module.exports = {
  OptionalItemCost
};