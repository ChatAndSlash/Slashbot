"use strict";

const { PROPERTIES, FLAGS } = require('@constants');

const { sprintf } = require("sprintf-js");

/**
 * Attacks with a chilling attack.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 * @param {string} dodgeText - The text template to use when this attack is dodged.
 * @param {string} missText - The text template to use when this attack misses.
 * @param {string} text - The text template to use when this attack hits.
 *
 * @return {Mixin}
 */
const ChillAction = (actionWeight, {
  multiplier = 1,
  chilledTurns = 10,
  isRanged = false,
  dodgeText = ":dash: %s attacks, but you dodge!",
  missText = "%s attacks, but misses!",
  attackText = ":snowflake: %s attacks you, dealing %s damage and chilling you.%s"
} = {}) => {
  return (Enemy) => class extends Enemy {
    constructor(info) {
      super(info);

      this.fightActionProperties.chill = [
        PROPERTIES.IS_ATTACK,
        PROPERTIES.CHILL_ATTACK,
      ];

      if (isRanged) {
        this.fightActionProperties.chill.push(PROPERTIES.RANGED_ATTACK);
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
      if ( ! character.hasFlag(FLAGS.HOT_CHOCOLATE_TURNS)) {
        actions.chill = actionWeight;
      }

      return super.getFightActions(character, actions);
    }

    /**
     * Chill the character.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    chill(character) {
      return this.attackHelper(character, (attackInfo) => {
        let messages = [];

        attackInfo.damage = Math.ceil(attackInfo.damage * multiplier);

        const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? " _Critical hit!_" : "";
        const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : "no";

        character.decreaseHp(attackInfo.damage);

        messages.push(sprintf(attackText, this.getDisplayName(character), damageText, critText));
        messages = messages.concat(character.addStatusChilled(chilledTurns));

        return messages;
      }, dodgeText, missText);
    }
  };
};

module.exports = {
  ChillAction
};