"use strict";

const FLAGS        = require('@constants').FLAGS;
const PROPERTIES   = require('@constants').PROPERTIES;

/**
 * Burns the character.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 * @param {string} dodgeText - The text template to use when this attack is dodged.
 * @param {string} missText - The text template to use when this attack misses.
 * @param {string} text - The text template to use when this attack hits.
 *
 * @return {Mixin}
 */
const BurnAction = (actionWeight, {
  multiplier = 1,
  burnedTurns = 6,
  isRanged = false,
  dodgeText = ":dash: %s shoots flame at you but you dodge!",
  missText = "%s shoots flame at you but misses!",
  attackText = ":fire: %s shoots flame at you, dealing %s damage and burning you.%s"
} = {}) => {
  return (Enemy) => class extends Enemy {
    constructor(info) {
      super(info);

      this.fightActionProperties.burn = [
        PROPERTIES.IS_ATTACK,
        PROPERTIES.BURN_ATTACK,
      ];

      if (isRanged) {
        this.fightActionProperties.burn.push(PROPERTIES.RANGED_ATTACK);
      }
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
      if ( ! character.hasFlag(FLAGS.COLD_COMPRESS_TURNS)) {
        actions.burn = actionWeight;
      }

      return super.getFightActions(character, actions);
    }

    /**
     * Burn the character.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    burn(character) {
      return this.attackHelper(character, (attackInfo) => {
        let messages = [];

        attackInfo.damage = Math.ceil(attackInfo.damage * multiplier);

        character.decreaseHp(attackInfo.damage);

        const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
        const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
        messages.push(__(attackText, this.getDisplayName(character), damageText, critText));

        messages = messages.concat(character.addStatusBurned(burnedTurns));

        return messages;
      }, dodgeText, missText);
    }
  };
};

module.exports = {
  BurnAction
};