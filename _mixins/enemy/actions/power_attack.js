"use strict";

const PROPERTIES = require('@constants').PROPERTIES;

/**
 * Does an extra-powerful attack.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 * @param {float} multiplier - The amount to increase damage by.
 * @param {string} text - The text to use to describe the attack.
 *
 * @return {Mixin}
 */
const PowerAttackAction = (actionWeight, {
  multiplier = 1.5,
  text = "%s hits you with an extra-powerful attack for %s damage!%s"
} = {}) => {
  return (Enemy) => class extends Enemy {
    constructor(info) {
      super(info);

      this.fightActionProperties.powerAttack = [
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
      actions.powerAttack = actionWeight;

      return super.getFightActions(character, actions);
    }

    /**
     * Perform the extra-powerful attack.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    powerAttack(character) {
      return this.attackHelper(character, (attackInfo) => {
        const damage = Math.ceil(attackInfo.damage * multiplier);
        const critText   = attackInfo.didCrit && damage > 0 ? __(' _Critical hit!_') : '';
        const attackText = damage > 0 ? `*${damage}*` : __('no');

        character.decreaseHp(damage);

        return [__(text, this.getDisplayName(character), attackText, critText)];
      });
    }
  };
};

module.exports = {
  PowerAttackAction
};