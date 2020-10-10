"use strict";

const PROPERTIES = require('@constants').PROPERTIES;

/**
 * Does an extra-powerful attack, but suffers some of the damage back themself.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 * @param {float} multiplier - The amount to increase damage by.
 * @param {float} selfDamageMultiplier - The % of damage to do back to own self.
 * @param {string} text - The text to use to describe the attack.
 *
 * @return {Mixin}
 */
const RecklessAttackAction = (actionWeight, {
  multiplier = 2,
  selfDamageMultiplier = 0.2,
  text = "%s attacks you recklessly, dealing %s damage and taking %s damage in return!%s"
} = {}) => {
  return (Enemy) => class extends Enemy {
    constructor(info) {
      super(info);

      this.fightActionProperties.recklessAttack = [
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
      actions.recklessAttack = actionWeight;

      return super.getFightActions(character, actions);
    }

    /**
     * Perform the extra-powerful attack.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    recklessAttack(character) {
      return this.attackHelper(character, (attackInfo) => {

        const damage = Math.ceil(attackInfo.damage * multiplier);
        const selfDamage = Math.ceil(damage * selfDamageMultiplier);

        character.decreaseHp(damage);
        this.decreaseHp(selfDamage);

        return [__(
          text,
          this.getDisplayName(character),
          damage > 0 ? `*${damage}*` : __('no'),
          selfDamage > 0 ? `*${selfDamage}*` : __('no'),
          attackInfo.didCrit && damage > 0 ? __(' _Critical hit!_') : ''
        )];
      });
    }
  };
};

module.exports = {
  RecklessAttackAction
};