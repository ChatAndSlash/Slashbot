"use strict";

const FLAG_IS_DEFENDING = 'is_defending';
const DEFEND_REDUCTION  = 0.5;

/**
 * Defend for a round, taking less damage.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 * @param {integer} blindTurns - The number of turns the character is blinded for.
 * @param {string} blindText - Text to describe the blinding attack.
 *
 * @return {Mixin}
 */
const DefendAction = (actionWeight) => {
  return (Enemy) => class extends Enemy {
    constructor(info) {
      super(info);

      this.fightActionProperties.defend = [];
    }

    /**
     * Choose the fight action for this enemy.
     *
     * @param {Character} character - The character this enemy is fighting.
     *
     * @return {string}
     */
    chooseFightAction(character) {
      const fightAction = super.chooseFightAction(character);

      if ('defend' === fightAction) {
        this.setFlag(FLAG_IS_DEFENDING);
      }

      return fightAction;
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
      actions.defend = actionWeight;

      return super.getFightActions(character, actions);
    }

    /**
     * Defend for a round, taking less damage.
     *
     * @param {Character} character - The character being defended against.
     *
     * @return {array}
     */
    defend(character) {
      const verb = this.isAre === 'is' ? 'was' : 'were';
      return `${this.getDisplayName(character)} ${verb} defending against your attacks!`;
    }

    /**
     * If enemy is defending, receive half damage.
     *
     * @param {object} attackInfo - The attack information.
     * @param {Combatant} attacker - The attacking combatant.
     *
     * @return {object}
     */
    doDefenderPostAttackProcessing(attackInfo, attacker) {
      if (this.hasFlag(FLAG_IS_DEFENDING)) {
        this.clearFlag(FLAG_IS_DEFENDING);
        attackInfo.damage = Math.ceil(attackInfo.damage * DEFEND_REDUCTION);
      }

      return super.doDefenderPostAttackProcessing(attackInfo, this, attacker);
    }
  };
};

module.exports = {
  DefendAction
};

// take less damage in combatant.getwhatever