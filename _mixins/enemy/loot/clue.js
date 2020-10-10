"use strict";

const LootSlot = require('@app/loot').LootSlot;

/**
 * Add a chance to drop Clues to the enemy's loot table.
 *
 * @param {integer} chance - The chance out of 100 that this enemy will drop Clues.
 * @param {integer} min - The minimum amount this enemy will drop.
 * @param {integer} max - The maximum amount this enemy will drop.
 *
 * @return {Mixin}
 */
const DropsClues = (chance, min = 1, max = min) => {
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
        'clue',
        new LootSlot().addEntry(chance, 'quest-watermoon-clue', min, max).addNothing(nothingChance)
      );

      if (character.hasBoost('watermoon-scholar')) {
        loot.addSlot(
          'clue_boosted',
          new LootSlot().addEntry(100, 'quest-watermoon-clue', 1, 1)
        );
      }

      return loot;
    }
  };
};

module.exports = {
  DropsClues
};