"use strict";

const Text = require('@util/text');

const FLAGS      = require('@constants').FLAGS;
const PROPERTIES = require('@constants').PROPERTIES;

const FLAG_BLIND_COOLDOWN = 'blind_cooldown';

/**
 * Blind character, ensuring that they miss on all attacks.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 * @param {integer} duration - The number of turns the character is blinded for.
 * @param {string} blindText - Text to describe the blinding attack.
 *
 * @return {Mixin}
 */
const BlindAction = (actionWeight, {
  duration = 2,
  cooldown = 3,
  blindText = ":see_no_evil: %s attacks, dealing %s damage %s blinding you for %d turns.%s"
} = {}) => {
  return (Enemy) => class extends Enemy {
    constructor(info) {
      super(info);

      this.fightActionProperties.blind = [
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
      if ( ! this.hasFlag(FLAG_BLIND_COOLDOWN)) {
        actions.blind = actionWeight;
      }

      return super.getFightActions(character, actions);
    }

    /**
     * Blind your opponent.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    blind(character) {
      return this.attackHelper(character, (attackInfo) => {
        character.setFlag(FLAGS.BLIND_TURNS, duration + 1);

        const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
        const attackText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
        const joinText = attackInfo.damage > 0 ? __("and") : __("but");
        character.decreaseHp(attackInfo.damage);
        this.setFlag(FLAG_BLIND_COOLDOWN, cooldown);

        return __(blindText, this.getDisplayName(character), attackText, joinText, duration, critText);
      });
    }

    /**
     * Perform any actions that happen after the round (decrement/clear all timers, etc)
     *
     * @param {Character} character - The character facing this enemy.
     *
     * @return {array} Messages generated by these actions.
     */
    doPostRoundActions(character) {
      let messages = super.doPostRoundActions(character);

      // Character is blind?
      if (character.hasFlag(FLAGS.BLIND_TURNS)) {
        const turns = character.getFlag(FLAGS.BLIND_TURNS);
        const turnText = (turns > 0) ? __("for %d more %s", turns, Text.pluralize("turn", turns)) : "";
        messages.push(__(":see_no_evil: You flail around blindly, unable to hit anything %s!", turnText));
      }

      if (this.hasFlag(FLAG_BLIND_COOLDOWN)) {
        this.decrementFlag(FLAG_BLIND_COOLDOWN);
      }

      return messages;
    }
  };
};

module.exports = {
  BlindAction
};