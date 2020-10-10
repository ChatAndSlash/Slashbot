"use strict";

const LootSlot = require('@app/loot').LootSlot;

/**
 * Add a chance to drop Moondrops to the enemy's loot table.
 *
 * @param {integer} chance - The chance out of 100 that this enemy will drop Moondrops.
 * @param {integer} min - The minimum amount of acid this enemy will drop.
 * @param {integer} max - The maximum amount of acid this enemy will drop.
 *
 * @return {Mixin}
 */
const DropsMoondrop = (chance, min = 1, max = min) => {
  return (Enemy) => class extends Enemy {
    /**
     * Returns the loot this enemy is carrying.
     *
     * @param {Character} character - The character that is fighting this enemy.
     *
     * @return {object}
     */
    getLoot(character) {
      let loot = super.getLoot(character);

      const nothingChance = 100 - chance;

      loot.addSlot(
        'moondrop',
        new LootSlot().addEntry(chance, 'catalyst-moondrop', min, max).addNothing(nothingChance)
      );

      return loot;
    }
  };
};

module.exports = {
  DropsMoondrop
};