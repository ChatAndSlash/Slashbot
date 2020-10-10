"use strict";

const { sprintf } = require("sprintf-js");

const { FLAGS, PROPERTIES } = require('@constants');

const FLAG_POISON_COOLDOWN = 'poison_cooldown';

/**
 * Perform an attack that poisons the character.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 * @param {integer} strength - The strength of the poison out of 100 (% of attack damage).
 * @param {integer} duration - The duration of the poison.
 * @param {string} text - The combat text to display on a successful poison attack.
 *
 * @return {Mixin}
 */
const PoisonAction = (actionWeight, {
  strength = 50,
  duration = 8,
  cooldown = 8,
  text = ":syringe: %s bites you, inflicting a seemingly minor wound.  However, after a few short moments you can feel the poison begin to set in!"
} = {}) => {
  return (Enemy) => class extends Enemy {
    constructor(info) {
      super(info);

      this.fightActionProperties.poisonAttack = [
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
      if ( ! this.hasFlag(FLAG_POISON_COOLDOWN)) {
        actions.poisonAttack = actionWeight;
      }

      return super.getFightActions(character, actions);
    }

    /**
     * Poison the character.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    poisonAttack(character) {
      character.setFlag(FLAGS.POISONED_TURNS, duration + 1);
      character.setFlag(FLAGS.POISON_DAMAGE, this.getPoisonDamage(character));
      this.setFlag(FLAG_POISON_COOLDOWN, cooldown);

      return [sprintf(text, this.getDisplayName(character))];
    }

    /**
     * Get the amount of damage this enemy's poison attack does.
     * Note: Poison cannot crit.
     *
     * @param {Combatant} opponent - The opponent to poison.
     *
     * @return {integer}
     */
    getPoisonDamage(opponent) {
      const attackInfo = this.getEffectAttackInfo(opponent);
      return Math.max(1, Math.ceil(attackInfo.damage / 100 * strength));
    }

    /**
     * Perform any actions that happen after the round (decrement/clear all timers, etc)
     *
     * @param {Combatant} opponent - The current combatant's opponent.
     *
     * @return {array} Messages generated by these actions.
     */
    doPostRoundActions(opponent) {
      const messages = super.doPostRoundActions(opponent);

      if (this.hasFlag(FLAG_POISON_COOLDOWN)) {
        this.decrementFlag(FLAG_POISON_COOLDOWN);
      }

      return messages;
    }

    /**
     * Special actions to take when the fight with this enemy is complete, regardless of win/loss.
     *
     * NOTE: Any additionally enqueued messages NEED a delay in order to ensure they show up after
     * the action fight message.
     *
     * @param {Character} character - The character who was in the fight.
     * @param {array} messages - The messages already generated in this fight.
     *
     * @return {array}
     */
    doFightEnd(character, messages) {
      character.clearFlag(FLAGS.POISON_DAMAGE);

      return super.doFightEnd(character, messages);
    }
  };
};

module.exports = {
  PoisonAction
};