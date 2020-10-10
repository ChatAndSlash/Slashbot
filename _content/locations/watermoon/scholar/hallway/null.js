"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const HallwayLocation   = require('@mixins/location/hallway').HallwayLocation;

const FLAGS = require('@constants').FLAGS;

/**
 * Null hallway.  Cannot use magic.
 */
class NullHallwayLocation extends mix(WatermoonLocation).with(HallwayLocation()) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallway-null',
      displayName: __('Null Hallway'),
      image: 'locations/watermoon/null-hallway.png',
      enemies: [
        { value: 'watermoon-scholar-hallways-starving_lion', weight: 1 },
        { value: 'watermoon-scholar-hallways-gryphon', weight: 1 },
        { value: 'watermoon-scholar-hallways-chimera', weight: 1 },
        { value: 'watermoon-scholar-hallways-cyclops', weight: 1 },
        { value: 'watermoon-scholar-hallways-amphisbaena', weight: 1 },
        { value: 'watermoon-scholar-hallways-crocotta', weight: 1 },
        { value: 'watermoon-scholar-hallways-manticore', weight: 1 },
        { value: 'watermoon-scholar-hallways-myrmekes', weight: 1 },
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
    return __("*Watermoon, Scholar District*\nStrange designs and materials have been used to construct the walls of this hallway.  You go to make an appreciative noise, only to notice that no sound passes your lips.  These walls absorb all sound, rendering you unable to cast magic!%s", progressText);
  }

  /**
   * Choose an enemy to fight.
   *
   * @param {Character} character - The character starting the fight.
   * @param {object} message - The message that was passed to slashbot.
   */
  chooseEnemy(character, message) {
    let title = super.chooseEnemy(character, message);

    character.setFlag(FLAGS.CANNOT_CAST);

    title +=  __("\n:zipper_mouth_face: The walls of this hallway absorb all sound you make, rendering you unable to cast any spells!");

    return title;
  }

  /**
   * Perform any post-fight actions that always happen.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - The messages already generated in this fight.
   *
   * @return {array}
   */
  doFightEnd(character, messages) {
    character.clearFlag(FLAGS.CANNOT_CAST);

    return messages;
  }
}

module.exports = NullHallwayLocation;