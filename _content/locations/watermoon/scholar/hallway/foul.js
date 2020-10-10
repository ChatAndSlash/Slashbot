"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const HallwayLocation   = require('@mixins/location/hallway').HallwayLocation;

const FLAGS = require('@constants').FLAGS;

const POISON_TURNS = 100;
const POISON_STRENGTH = 50;

/**
 * Foul hallway.  Start each fight poisoned.
 */
class FoulHallwayLocation extends mix(WatermoonLocation).with(HallwayLocation()) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallway-foul',
      displayName: __('Foul Hallway'),
      image: 'locations/watermoon/foul-hallway.png',
      enemies: [
        { value: 'watermoon-scholar-hallways-winged_serpent', weight: 1 },
        { value: 'watermoon-scholar-hallways-satyr', weight: 1 },
        { value: 'watermoon-scholar-hallways-chimera', weight: 1 },
        { value: 'watermoon-scholar-hallways-arae', weight: 1 },
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
    return __("*Watermoon, Scholar District*\nThe pores in the walls and floor of this hallway ooze a thin, gaseous, poisonous cloud.  It's a light poison, but painful all the same.%s", progressText);
  }

  /**
   * Choose an enemy to fight.
   *
   * @param {Character} character - The character starting the fight.
   * @param {object} message - The message that was passed to slashbot.
   */
  chooseEnemy(character, message) {
    let title = super.chooseEnemy(character, message);

    character.setFlag(FLAGS.POISON_DAMAGE, this.getPoisonDamage(character));
    character.setFlag(FLAGS.POISONED_TURNS, POISON_TURNS);

    title +=  __("\n:cloud: You cough and wheeze, the poison from the hallway clogging your lungs.");

    return title;
  }

  /**
   * Get the amount of damage this hallway's poison attack does.
   * Note: Poison cannot crit.
   *
   * @param {Character} character - The character to get poison damage for.
   *
   * @return {integer}
   */
  getPoisonDamage(character) {
    const attackInfo = character.getEffectAttackInfo(character);
    return Math.max(1, Math.ceil(attackInfo.damage / 100 * POISON_STRENGTH));
  }

}

module.exports = FoulHallwayLocation;