"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const HallwayLocation   = require('@mixins/location/hallway').HallwayLocation;

/**
 * Hard hallway.  Enemies are +.
 */
class HardHallwayLocation extends mix(WatermoonLocation).with(HallwayLocation()) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallway-hard',
      displayName: __('Hard Hallway'),
      image: 'locations/watermoon/hard-hallway.png',
      enemies: [
        { value: 'watermoon-scholar-hallways-winged_serpent', weight: 1 },
        { value: 'watermoon-scholar-hallways-starving_lion', weight: 1 },
        { value: 'watermoon-scholar-hallways-satyr', weight: 1 },
        { value: 'watermoon-scholar-hallways-gryphon', weight: 1 },
        { value: 'watermoon-scholar-hallways-chimera', weight: 1 },
        { value: 'watermoon-scholar-hallways-cyclops', weight: 1 },
      ],
    });
  }

  /**
   * Gets the description for this location.
   *
   * @param {Character} character - The character getting the description.
   *
   * @return {string}
   */
  getDescription(character) {
    const progressText = this.getProgressText(character);
    return __("*Watermoon, Scholar District*\nThis hallway seems to be the place where the toughest of enemies hang out, swap stories, and beat on unwary adventurers who wander through.%s", progressText);
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
    // Don't buff minibosses based on hard hallway
    if (this.bossTypes.includes(type)) {
      return super.getEnemyLevelBonus(enemy, character, type);
    }

    return Math.ceil(this.getEnemyLevel(enemy, character) * 0.2)
      + super.getEnemyLevelBonus(enemy, character, type);
  }
}

module.exports = HardHallwayLocation;