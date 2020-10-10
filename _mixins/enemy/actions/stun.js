"use strict";

const FLAGS      = require('@constants').FLAGS;
const PROPERTIES = require('@constants').PROPERTIES;

/**
 * Deal damage and stun the character.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 * @param {integer} duration - The number of turns to stun the enemy for.
 * @param {string} dodgeText - The text to display when this attack is dodged.
 * @param {string} missText - The text to display when this attack misses.
 * @param {string} attackText - The text to display when attacking.
 *
 * @return {Mixin}
 */
const StunAction = (actionWeight, {
  duration = 1,
  cooldown = 3,
  dodgeText = ":dash: %s attacks, but you dodge!",
  missText = "%s attacks, but misses!",
  attackText = "%s attacks you, dealing %s damage and stunning you for %d turns!%s"
} = {}) => {
  return (Enemy) => class extends Enemy {
    constructor(info) {
      super(info);

      this.fightActionProperties.doStun = [
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
      if ( ! this.hasFlag(FLAGS.STUN_COOLDOWN)) {
        actions.doStun = actionWeight;
      }

      return super.getFightActions(character, actions);
    }

    /**
     * Stun your opponent.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    doStun(character) {
      return this.attackHelper(character, (attackInfo) => {
        let messages = [];

        character.setFlag(FLAGS.STUNNED_TURNS, duration + 1);

        const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
        const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
        messages.push(__(attackText, this.getDisplayName(character), damageText, duration, critText));
        this.setFlag(FLAGS.STUN_COOLDOWN, cooldown);

        character.decreaseHp(attackInfo.damage);

        return messages;
      }, dodgeText, missText);
    }
  };
};

module.exports = {
  StunAction
};