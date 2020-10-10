"use strict";

const PROPERTIES = require('@constants').PROPERTIES;

/**
 * Explode!  Do a bunch of damage and die.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 * @param {float} explodeFloor - The % of Max HP the enemy has a chance of exploding at.
 * @param {float} explodePower - The % of Max HP that this enemy explodes for.
 *
 * @return Mixin
 */
const ExplodeAction = (actionWeight, explodeFloor, explodePower) => {
  return (Enemy) => class extends Enemy {
    constructor(info) {
      super(info);

      this.fightActionProperties.explode = [
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
      if (this.hp <= Math.ceil(this.maxHp * explodeFloor)) {
        actions.explode = actionWeight;
      }

      return super.getFightActions(character, actions);
    }

    /**
     * Explode!  Enemy loses all the rest of their HP and deals a percentage of Max HP.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    explode(character) {
      let messages = [];

      const explodeDamage = Math.ceil(this.maxHp * explodePower);

      this.hp = 0;
      character.decreaseHp(explodeDamage);

      messages.push(__("%s explodes into tiny bits, dealing %d damage to you and grossing you out as well.", this.getDisplayName(character), explodeDamage));

      return messages;
    }
  };
};

module.exports = {
  ExplodeAction
};