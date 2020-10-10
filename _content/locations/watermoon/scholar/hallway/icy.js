"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const HallwayLocation   = require('@mixins/location/hallway').HallwayLocation;

const FLAGS = require('@constants').FLAGS;

/**
 * Icy hallway.  Neither side can dodge.
 */
class IcyHallwayLocation extends mix(WatermoonLocation).with(HallwayLocation()) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallway-icy',
      displayName: __('Icy Hallway'),
      image: 'locations/watermoon/icy-hallway.png',
      enemies: [
        { value: 'watermoon-scholar-hallways-centaur_archer', weight: 1 },
        { value: 'watermoon-scholar-hallways-centaur_slasher', weight: 1 },
        { value: 'watermoon-scholar-hallways-centaur_bladesmith', weight: 1 },
        { value: 'watermoon-scholar-hallways-centaur_faithful', weight: 1 },
        { value: 'watermoon-scholar-hallways-centaur_warmage', weight: 1 },
        { value: 'watermoon-scholar-hallways-harpy_mistress', weight: 1 },
        { value: 'watermoon-scholar-hallways-harpy_witch', weight: 1 },
        { value: 'watermoon-scholar-hallways-harpy_bladesong', weight: 1 },
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
    return __("*Watermoon, Scholar District*\nThis hallway is freezing, literally!  Beneath your feet is a thick crust of ice that you have to expend extra care not to slip and fall over on.  So much care that you won't be able to dodge in battle!%s", progressText);
  }

  /**
   * Perform any actions that need to happen at the start of a fight turn.
   *
   * @param {Character} character - The character in the fight.
   * @param {array} messages - Messages to add to.
   *
   * @return {array}
   */
  doFightTurnStart(character, messages) {
    if ( ! this.bossTypes.includes(character.enemy.type)) {
      character.setFlag(FLAGS.CANNOT_DODGE);
      character.enemy.setFlag(FLAGS.CANNOT_DODGE);
    }

    return messages;
  }

  /**
   * Choose an enemy to fight.
   *
   * @param {Character} character - The character starting the fight.
   * @param {object} message - The message that was passed to slashbot.
   */
  chooseEnemy(character, message) {
    let title = super.chooseEnemy(character, message);

    title +=  __("\n:snowflake: The ground beneath you is icy and slippery.  You and your opponent must concentrate on your footing, and as a result, neither will be able to dodge!");

    return title;
  }
}

module.exports = IcyHallwayLocation;