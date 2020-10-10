"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const HallwayLocation   = require('@mixins/location/hallway').HallwayLocation;

/**
 * Easy hallway.  Enemies are -.
 */
class EasyHallwayLocation extends mix(WatermoonLocation).with(HallwayLocation()) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallway-easy',
      displayName: __('Easy Hallway'),
      image: 'locations/watermoon/easy-hallway.png',
      enemies: [
        { value: 'watermoon-scholar-hallways-centaur_archer', weight: 1 },
        { value: 'watermoon-scholar-hallways-centaur_bladesmith', weight: 1 },
        { value: 'watermoon-scholar-hallways-centaur_warmage', weight: 1 },
        { value: 'watermoon-scholar-hallways-harpy_witch', weight: 1 },
        { value: 'watermoon-scholar-hallways-harpy_chieftess', weight: 1 },
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
    return __("*Watermoon, Scholar District*\nThe enemies that wander this hallway are pathetic, weak, and barely able to offer a challenge.%s", progressText);
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
    // Don't debuff minibosses based on hard hallway
    if (this.bossTypes.includes(type)) {
      return super.getEnemyLevelBonus(enemy, character, type);
    }

    return Math.ceil(this.getEnemyLevel(enemy, character) * -0.2)
      + super.getEnemyLevelBonus(enemy, character, type);
  }
}

module.exports = EasyHallwayLocation;