"use strict";

const Random = require('@util/random');

class Loot {
  /**
   * Take in any number of LootSloots, assign them in order.
   *
   * @param {array} slots - The LootSloots to add.
   */
  constructor(...slots) {
    this.collection = slots;
  }

  /**
   * Add a loot slot.
   *
   * @param {string} name - The name for this slot.
   * @param {LootSlot} slot - The slot to add.
   */
  addSlot(name, slot) {
    this.collection[name] = slot;

    return this;
  }

  /**
   * Get the collection of loot slots.
   *
   * @return {object}
   */
  getCollection() {
    return this.collection;
  }

  /**
   * Randomly choose loot from the collection.
   *
   * @return {array}
   */
  chooseLoot() {
    let items = [];

    for (const slot in this.collection) {
      const choice = Random.getWeighted(this.collection[slot].getCollection());
      if (choice && choice !== 'nothing') {
        const min = _.get(choice, 'min', 1);
        const max = _.get(choice, 'max', min);
        items.push({ type: choice.type, quantity: Random.between(min, max) });
      }
    }

    return items;
  }
}

class LootSlot {
  constructor() {
    this.collection = [];
  }

  /**
   * Add a chance at getting an item to this loot slot.
   *
   * @param {integer} weight - The chance of getting this item.
   * @param {string} type - The type of the item.
   * @param {integer} min - The minimum amount.
   * @param {integer} max - The maximum amount.
   *
   * @return {LootSlot}
   */
  addEntry(weight, type, min = 1, max = min) {
    this.collection.push({ weight, value: { type, min, max } });

    return this;
  }

  /**
   * Add a chance at getting nothing to this loot slot.
   *
   * @param {integer} weight - The chance of getting nothing.
   *
   * @return {LootSlot}
   */
  addNothing(weight) {
    this.collection.push({ weight, value: 'nothing' });

    return this;
  }

  /**
   * Get the collection of loot entries in this slot.
   *
   * @return {array}
   */
  getCollection() {
    return this.collection;
  }
}

module.exports = {
  Loot,
  LootSlot
};