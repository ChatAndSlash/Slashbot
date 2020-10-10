"use strict";

const LootSlot = require('@app/loot').LootSlot;

/**
 * Add a chance to drop Essence Crystals to the enemy's loot table.
 *
 * @param {integer} chance - The chance out of 100 that this enemy will drop Essence Crystals.
 * @param {integer} min - The minimum amount this enemy will drop.
 * @param {integer} max - The maximum amount this enemy will drop.
 *
 * @return {Mixin}
 */
const DropsEssenceCrystals = (chance, min = 1, max = min) => {
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
        'essence_crystal',
        new LootSlot().addEntry(chance, 'quest-watermoon-essence_crystal', min, max).addNothing(nothingChance)
      );

      if (character.hasBoost('watermoon-mystic')) {
        loot.addSlot(
          'essence_crystal_boosted',
          new LootSlot().addEntry(100, 'quest-watermoon-essence_crystal', 1, 1)
        );
      }

      return loot;
    }
  };
};

module.exports = {
  DropsEssenceCrystals
};