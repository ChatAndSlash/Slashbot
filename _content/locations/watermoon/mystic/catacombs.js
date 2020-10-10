"use strict";

const { WatermoonLocation } = require('@app/content/locations/watermoon');

const { FLAGS } = require('@constants');

/**
 * Catacombs, where the Necrodragon is located.
 */
class CatacombsLocation extends WatermoonLocation {
  constructor() {
    super({
      type: 'watermoon-mystic-catacombs',
      displayName: "Catacombs",
      image: 'locations/watermoon/catacombs.png',
      connectedLocations: [
        'watermoon-mystic-plaza',
      ],
    });
  }

  /**
   * Get the description for this location.
   *
   * @param {Character} character - The character entering the location.
   *
   * @return {string}
   */
  getDescription(character) {
    if ( ! character.hasKilledEnemy('watermoon-mystic-necrodragon')) {
      return "*Watermoon, Mystic District*\nDeep beneath the earth, you wander down corridors that are wide and tall, yet poorly-lit.  You can barely see your hand in front of your face, but are loathe to place your hand on the walls for guidance, as they are damp with what you hope is only water.  Neither torches nor anything else improve your visibility, as the darkness that surrounds you is magical in origin.\n\nFar in the distance, you can hear the terrible breathing of a massive beast.  Clearly you are in the Necrodragon's lair at last.";
    }
    else {
      return "*Watermoon, Mystic District*\nDeep beneath the earth, you wander down corridors that are wide and tall, yet poorly-lit.  You can barely see your hand in front of your face, but are loathe to place your hand on the walls for guidance, as they are damp with what you hope is only water.  Neither torches nor anything else improve your visibility, as the darkness that surrounds you is magical in origin.\n\nFar in the distance, you can hear the terrible breathing of an awful beast.  Clearly you are in the lair of something monstrous and evil.";
    }
  }

  /**
   * No Cursed Chests in here.
   *
   * @param {Character} character - The character to add the chest for.
   *
   * @return boolean
   */
  shouldAddCursedChest(character) {
    return false;
  }

  /**
   * Populate encounter choices to randomly draw from.
   * This can be overridden in specific locations to add/remove encounters from the population
   * base on the character.
   *
   * @param {Character} character - The character in this location.
   *
   * @return {array}
   */
  getEncounters(character) {
    if ( ! character.hasKilledNecrodragon()) {
      const times = character.getFlag(FLAGS.NECRODRAGON_DEFEATS, 0);

      if (0 === times) {
        return [{ value: 'watermoon-mystic-necrodragon_intro', weight: 100 }];
      }
      else if (1 === times) {
        return [{ value: 'watermoon-mystic-necrodragon_second', weight: 100 }];
      }
      else if (2 === times) {
        return [{ value: 'watermoon-mystic-necrodragon_third', weight: 100 }];
      }
      else if (3 === times) {
        return [{ value: 'watermoon-mystic-necrodragon_final', weight: 100 }];
      }
    }
    else {
      return [{ value: 'fight', weight: 100 }];
    }
  }

  /**
   * Populate enemy choices to randomly draw from.
   * This can be overridden in specific locations to add/remove enemies from the population based
   * on the character.
   *
   * @param {Character} character - The character in this location.
   *
   * @return {array}
   */
  getEnemies(character) {
    return [{ value: character.getFlag(FLAGS.MYSTIC_BOSS), weight: 1 }];
  }

  /**
   * Necrodragon gets 50% level bonus, guardians, none.
   *
   * @param {Enemy} enemy - The enemy to get the level bonus for.
   * @param {Character} character - The character in this location.
   * @param {string} type - The type of the enemy to check.
   *
   * @return {integer}
   */
  getEnemyLevelBonus(enemy, character, type) {
    if (type === 'watermoon-mystic-necrodragon') {
      const level = character.location.getEnemyLevel(enemy, character);
      return Math.ceil(level * 0.5) + super.getEnemyLevelBonus(enemy, character, type);
    }

    return super.getEnemyLevelBonus(enemy, character, type);
  }
}

module.exports = CatacombsLocation;