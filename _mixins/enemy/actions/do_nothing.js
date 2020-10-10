"use strict";

const PROPERTIES = require('@constants').PROPERTIES;

/**
 * Does... nothing.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 * @param {string} text - The text to use to describe the attack.
 *
 * @return {Mixin}
 */
const DoNothingAction = (actionWeight, {
  text = "%s does... nothing, simply considering you.",
} = {}) => {
  return (Enemy) => class extends Enemy {
    constructor(info) {
      super(info);

      this.fightActionProperties.doNothing = [
        PROPERTIES.IS_ATTACK,
      ];
    }

    /**
     * Get the fight actions for this enemy.
     *
     * @param {Character} character - The character this enemy is fighting.
     * @param {object} actions - Actions passed in from mixed-in actions.
     *
     * @return {object}
     */
    getFightActions(character, actions = {}) {
      actions.doNothing = actionWeight;

      return super.getFightActions(character, actions);
    }

    /**
     * Perform the extra-powerful attack.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    doNothing(character) {
      return [__(text, this.getDisplayName(character))];
    }
  };
};

module.exports = {
  DoNothingAction
};