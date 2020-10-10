"use strict";

const PROPERTIES = require('@constants').PROPERTIES;

const FLAG_BERSERK_TURNS = 'berserk_turns';

/**
 * Flies into a rage, attacking for two more turns.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 *
 * @return {Mixin}
 */
const BerserkAction = (actionWeight) => {
  return (Enemy) => class extends Enemy {
    constructor(info) {
      super(info);

      this.fightActionProperties.berserkAttack = [
        PROPERTIES.IS_ATTACK,
      ];
    }

    /**
     * Choose the fight action for this enemy.
     *
     * @param {Character} character - The character this enemy is fighting.
     *
     * @return {string}
     */
    chooseFightAction(character) {
      if (this.hasFlag(FLAG_BERSERK_TURNS)) {
        return 'berserkAttack';
      }

      return super.chooseFightAction(character);
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
      actions.getBerserk = actionWeight;

      return super.getFightActions(character, actions);
    }

    /**
     * Perform any actions that happen after the round (decrement/clear all timers, etc)
     *
     * @param {Combatant} opponent - The current combatant's opponent.
     *
     * @return {array} Messages generated by these actions.
     */
    doPostRoundActions(opponent) {
      let messages = super.doPostRoundActions(opponent);

      this.decrementFlag(FLAG_BERSERK_TURNS);

      return messages;
    }

    /**
     * Perform an berserk attack, and set a flag so that's all you do for the next couple turns.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    getBerserk(character) {
      this.setFlag(FLAG_BERSERK_TURNS, 3);

      return this.berserkAttack(character);
    }

    /**
     * Allow attack parameters to be modified before being used in an attack.
     *
     * @param {object} params - The parameters to modify.
     * @param {Combatant} defender - The defender of the attack.
     * @param {Character} character - The attacking character.
     *
     * @return {object}
     */
    attackerModifyAttackParameters(params, defender) {
      if (this.hasFlag(FLAG_BERSERK_TURNS)) {
        params.multiplier += 1;
      }

      return super.attackerModifyAttackParameters(params, defender);
    }

    /**
     * Perform an berserk attack.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    berserkAttack(character) {
      return this.attackHelper(character, (attackInfo) => {
        let messages = [];

        const displayName = this.getDisplayName(character);
        const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
        const attackText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
        messages.push(__("%s attacks you for for %s damage!%s", displayName, attackText, critText));

        const berserkTurns = this.getFlag(FLAG_BERSERK_TURNS);
        if (berserkTurns > 1) {
          messages.push(__("%s has gone berserk and will only attack for %d more turns!", displayName, berserkTurns - 1));
        }

        character.decreaseHp(attackInfo.damage);

        return messages;
      });
    }
  };
};

module.exports = {
  BerserkAction
};