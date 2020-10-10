"use strict";

/**
 * Enemy, heal thyself.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 * @param {float} strength - The % of max HP that will be cured.
 * @param {string} text - The text used to describe the action.
 *
 * @return {Mixin}
 */
const HealAction = (actionWeight, {
  strength = 0.20,
  text = "%s heals themselves of %d damage."
} = {}) => {
  return (Enemy) => class extends Enemy {
    /**
     * Get the fight actions for this enemy.
     *
     * @param {Character} character - The character this enemy is fighting.
     * @param {object} actions - Actions passed in from mixed-in actions.
     *
     * @return {object}
     */
    getFightActions(character, actions = {}) {
      actions.heal = actionWeight;

      return super.getFightActions(character, actions);
    }

    /**
     * Heal.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    heal(character) {
      let messages = [];

      const hp = this.increaseHp(Math.ceil(this.maxHp * strength));

      messages.push(__(text, this.getDisplayName(character), hp));

      return messages;
    }
  };
};

module.exports = {
  HealAction
};