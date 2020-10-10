"use strict";

const { getIncreaseForPercentage } = require('@util/num');
const { FLAGS }                    = require('@constants');
const { isHalloween }              = require('@util/events');

const SPIRIT_DRAGON_TYPE = 'event-spirit_dragon';
const SPIRIT_DRAGON_LEVEL_BONUS = 0.25;

/**
 * Locations that can host special event encounters.
 *
 * @return {Mixin}
 */
const EventLocation = () => {
  return (Location) => class extends Location {
    /**
     * Add event enemies.
     *
     * @param {Character} character - The character in this location.
     * @param {array} enemies - The normal enemies in this area.
     *
     *
     * @return {array}
     */
    addSpecialEnemies(character, enemies) {
      if (isHalloween()) {
        // What's the weight of all existing enemies?
        let totalWeight = 0;
        for (let enemy of enemies) {
          enemy.weight *= 100;
          totalWeight += enemy.weight;
        }

        // Add Spirit Dragon at appropriate level
        const weight = this.getSpiritDragonWeight(character, totalWeight);
        enemies.push({ value: SPIRIT_DRAGON_TYPE, weight });

        // Better chance of encountering Spirit Dragon next time
        character.incrementFlag(FLAGS.SPIRIT_DRAGON_FIGHTS);
      }

      return enemies;
    }

    /**
     * Set the enemy level based on the character's level, with a maximum of 26, 36, or 46,
     * based on the number of Watermoon dragons killed.
     *
     * @param {Enemy} enemy - The enemy to get the level for.
     * @param {Character} character - The character in this location.
     *
     * @return {integer}
     */
    getEnemyLevel(enemy, character) {
      if (isHalloween()) {
        if (enemy.type === SPIRIT_DRAGON_TYPE) {
          return character.level;
        }
      }

      return super.getEnemyLevel(enemy, character);
    }

    /**
     * Get a location-based level bonus.
     *
     * @param {Enemy} enemy - The enemy to get the level bonus for.
     * @param {Character} character - The character in this location.
     * @param {string} type - The type of the enemy to check.
     *
     * @return {integer}
     */
    getEnemyLevelBonus(enemy, character, type) {
      if (isHalloween()) {
        if (enemy.type === SPIRIT_DRAGON_TYPE) {
          const level = character.location.getEnemyLevel(enemy, character);
          return Math.ceil(level * SPIRIT_DRAGON_LEVEL_BONUS) + super.getEnemyLevelBonus(enemy, character, type);
        }
      }

      return super.getEnemyLevelBonus(enemy, character, type);
    }


    /**
     * Get the chance of encountering a Spirit Dragon, as a weight balanced against the total weight.
     *
     * @param {Character} character - The character to get the weight for.
     * @param {integer} totalWeight - The total weight of all encounters here so far.
     *
     * @return {integer}
     */
    getSpiritDragonWeight(character, totalWeight) {
      // Get number of fights since chest was last found to determine % chance of finding one
      const fightTurns = character.getFlag(FLAGS.SPIRIT_DRAGON_FIGHTS, 0);

      let dragonChance = 0;

      if (fightTurns <= 10) {
        dragonChance = 0;
      }
      else if (fightTurns <= 15) {
        dragonChance = 0.01;
      }
      else if (fightTurns <= 25) {
        dragonChance = 0.05;
      }
      else if (fightTurns <= 50) {
        dragonChance = 0.10;
      }
      else {
        dragonChance = 0.25;
      }

      return getIncreaseForPercentage(totalWeight, dragonChance);
    }
  };
};

module.exports = {
  EventLocation
};