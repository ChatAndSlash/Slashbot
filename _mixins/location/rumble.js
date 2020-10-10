"use strict";

const Random = require('@util/random');

const FLAGS      = require('@constants').FLAGS;
const PROPERTIES = require('@constants').PROPERTIES;

const GROUP_TYPE_MIX = 'mix';
const GROUP_TYPE_SOLOS = 'solos';
const GROUP_TYPE_GROUPS = 'groups';

/**
 * Scholar Labyrinth common functions.
 *
 * @return {Mixin}
 */
const RumbleLocation = () => {
  return (Location) => class extends Location {
    /**
     * Get the description for this location and character.
     * Allows for custom logic on a per-character basis.
     *
     * @param {Character} character - The character getting location description.
     *
     * @return {array}
     */
    getDescription(character) {
      if (this.isMinibossDefeated(character)) {
        return super.getDescription(character) + __("\n\nYou've already cleaned up the henchmen from this area.  It's time to move on to the next!");
      }
      // If miniboss not defeated & intro has played, display henchmen remaining
      else if (this.getNumFights(character) > 0) {
        const total = this.getTotalHenchmen(character);
        const defeated = Math.min(total, this.getDefeatedHenchmen(character));
        const nice = 69 === defeated ? "  Nice." : "";

        return super.getDescription(character) + __(
          "\n\nYou have defeated %d of %d henchmen.%s",
          defeated,
          total,
          nice
        );
      }

      return super.getDescription(character);
    }

    /**
     * Miniboss gets 25% level bonus, henchmen none.
     *
     * @param {Enemy} enemy - The enemy to get the level bonus for.
     * @param {Character} character - The character in this location.
     * @param {string} type - The type of the enemy to check.
     *
     * @return {integer}
     */
    getEnemyLevelBonus(enemy, character, type) {
      if (type === this.getMinibossType()) {
        const level = character.location.getEnemyLevel(enemy, character);
        return Math.ceil(level * 0.25);
      }

      return super.getEnemyLevelBonus(enemy, character, type);
    }

    /**
     * Gets the number of henchmen defeated in this area.
     *
     * @param {Character} character - The character to check for defeated henchmen.
     *
     * @return {integer}
     */
    getDefeatedHenchmen(character) {
      return character.getFlag(FLAGS.HENCHMEN_DEFEATED);
    }

    /**
     * Gets the number of henchmen required to defeat in this area.
     *
     * @param {Character} character - The character to check for henchmen total.
     *
     * @return {integer}
     */
    getTotalHenchmen(character) {
      return 0;
    }

    /**
     * If all the henchmen at this location are defeated.
     *
     * @param {Character} character - The character to check.
     *
     * @return {boolean}
     */
    areHenchmenDefeated(character) {
      return this.getDefeatedHenchmen(character) >= this.getTotalHenchmen(character);
    }

    /**
     * Get the number of fights so far in this location.
     *
     * @param {Character} character - The character to check for.
     *
     * @return {integer}
     */
    getNumFights(character) {
      return character.getFlag(FLAGS.NUM_FIGHTS);
    }

    /**
     * If the miniboss for this location has been defeated.
     *
     * @param {Character} character - The character to check for defeated miniboss.
     *
     * @return {boolean}
     */
    isMinibossDefeated(character) {
      return character.getFlag(FLAGS.BOSS_DEFEATED_ + this.getMinibossType(), false);
    }

    /**
     * Get the type of the miniboss guarding the end of this location.
     *
     * @return {string}
     */
    getMinibossType() {
      throw new Error("Miniboss flag must be set.");
    }

    /**
     * Get the average progress expected in this location.
     *
     * @return {string}
     */
    getExpectedAverageProgress() {
      throw new Error("Average progress must be set.");
    }

    /**
     * Perform any post-fight actions that always happen.
     *
     * @param {Character} character - The character who won the fight.
     * @param {array} messages - The messages already generated in this fight.
     *
     * @return {array}
     */
    doFightSuccess(character, messages) {
      // Just defeated the miniboss?  Clear location flags.
      if (character.enemy.type === this.getMinibossType(character)) {
        character.clearFlag(FLAGS.NUM_FIGHTS);
        character.clearFlag(FLAGS.HENCHMEN_DEFEATED);
      }

      else if ( ! this.isMinibossDefeated(character)) {
        const defeated = character.enemy.properties.includes(PROPERTIES.IS_GROUP)
          ? this.getHenchGroupValue()
          : 1;

        character.incrementFlag(FLAGS.HENCHMEN_DEFEATED, defeated);
      }

      return super.doFightSuccess(character, messages);
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
      if ( ! this.isMinibossDefeated(character)) {
        character.incrementFlag(FLAGS.NUM_FIGHTS);
      }

      return messages;
    }

    /**
     * Get the type of enemy group that should be encountered (mostly solo, mostly group).
     *
     * @param {Character} character - The character to get the group type for.
     *
     * @return {string}
     */
    getEnemyGroupType(character) {
      const defeated  = this.getDefeatedHenchmen(character);
      const numFights = this.getNumFights(character);

      if (0 === numFights) {
        return GROUP_TYPE_MIX;
      }

      const average   = defeated / numFights;
      const expected  = this.getExpectedAverageProgress();

      // Too too much
      if (average > expected + 1) {
        return GROUP_TYPE_SOLOS;
      }
      // Too too little
      else if (average < expected - 1) {
        return GROUP_TYPE_GROUPS;
      }

      // Juuust right
      return GROUP_TYPE_MIX;
    }

    /**
     * Get the number of henchmen in the group that was just defeated.
     *
     * @retun {integer}
     */
    getHenchGroupValue() {
      return Random.between(3, 7);
    }

    /**
     * Get the type of the intro encounter.
     *
     * @return {string}
     */
    getIntroEncounterType() {
      throw new Error("No Intro Encounter defined.");
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
      const isMinibossDefeated = this.isMinibossDefeated(character);
      const fights = this.getNumFights(character);

      // If we haven't defeated any henchmen in this location, introduce to area.
      if ( ! isMinibossDefeated && 0 === fights) {
        return [{ value: this.getIntroEncounterType(), weight: 100 }];
      }

      let encounters = this.encounters;

      if (character.accessory.type === 'equipment-accessories-watermoon-050_goldscale_ring') {
        encounters = character.accessory.addGoldDrakeEncounter(encounters);
      }

      return encounters;
    }
  };
};

module.exports = {
  RumbleLocation,
  GROUP_TYPE_MIX: 'mix',
  GROUP_TYPE_SOLOS: 'solos',
  GROUP_TYPE_GROUPS: 'groups',
};