"use strict";

const { between } = require('@util/random');
const { times } = require('lodash');
const { sprintf } = require("sprintf-js");

const PROPERTIES = require('@constants').PROPERTIES;

/**
 * Does multipe attacks in a single round.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 * @param {integer} minAttacks - The minimum number of attacks to perform.
 * @param {integer} maxAttacks - The amximum number of attacks to perform.
 * @param {float} multiplier - The multiplier to apply to each attack's damage.
 * @param {string} dodgeText - The text to use when the attack is dodged.
 * @param {string} missText - The text to use when the attack misses..
 * @param {string} attackText - The text to use to describe the attack.
 *
 * @return {Mixin}
 */
const MultiAttackAction = (actionWeight, {
  minAttacks = 1,
  maxAttacks = 3,
  multiplier = 1,
  preText = ":triumph: %s prepares a flurry of blows!",
  dodgeText = ":dash: %s attacks, but you dodge!",
  missText = "%s attacks, but misses!",
  attackText = ":frowning: %s attacks, dealing %s damage to you.%s",
} = {}) => {
  return (Enemy) => class extends Enemy {
    constructor(info) {
      super(info);

      this.fightActionProperties.multiAttack = [
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
      actions.multiAttack = actionWeight;

      return super.getFightActions(character, actions);
    }

    /**
     * Perform multiple attacks.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    multiAttack(character) {
      let messages = [sprintf(preText, this.getDisplayName(character))];

      times(this.getNumberOfAttacks(), () => {
        messages = messages.concat(this.attackHelper(character, (attackInfo) => {
          const damage = Math.ceil(attackInfo.damage * multiplier);
          const critText   = attackInfo.didCrit && damage > 0 ? " _Critical hit!_" : "";
          const damageText = damage > 0 ? `*${damage}*` : "no";

          character.decreaseHp(damage);

          return sprintf(attackText, this.getDisplayName(character), damageText, critText);
        }, dodgeText, missText));
      });

      return messages;
    }

    /**
     * Get the number of attacks dealt by this attack.
     *
     * @return {integer}
     */
    getNumberOfAttacks() {
      return between(minAttacks, maxAttacks);
    }
  };
};

module.exports = {
  MultiAttackAction
};