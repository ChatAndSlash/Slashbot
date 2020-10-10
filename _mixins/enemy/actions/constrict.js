"use strict";

const Random = require('@util/random');

const FLAGS      = require('@constants').FLAGS;
const PROPERTIES = require('@constants').PROPERTIES;

const FLAG_IS_CONSTRICTING = 'is_constricting';
const CONSTRICT_TURNS = 2;
const CONSTRICT_DAMAGE = 0.75;

/**
 * Constrict character, stunning them and doing damage.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 *
 * @return {Mixin}
 */
const ConstrictAction = (actionWeight) => {
  return (Enemy) => class extends Enemy {
    constructor(info) {
      super(info);

      this.fightActionProperties.constrict = [
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
      actions.constrict = actionWeight;

      return super.getFightActions(character, actions);
    }

    /**
     * Choose the fight action for this enemy.
     *
     * @param {Character} character - The character this enemy is fighting.
     *
     * @return {string}
     */
    chooseFightAction(character) {
      // If constricting opponent
      if (this.hasFlag(FLAG_IS_CONSTRICTING)) {
        return 'beConstricting';
      }

      return super.chooseFightAction(character);
    }

    /**
     * Constrict character, doing 75% damage and stunning for 2 turns.
     *
     * @param {Character} character - The character being constricted.
     *
     * @return {array} Messages describing the attack.
     */
    constrict(character) {
      const dodgeText = ":dash: %s attempts to constrict you but you dodge!";
      const missText = "%s attempts to constrict you but misses!";

      return this.attackHelper(character, (attackInfo) => {
        character.setFlag(FLAGS.STUNNED_TURNS, CONSTRICT_TURNS + 1);
        this.setFlag(FLAG_IS_CONSTRICTING);

        attackInfo.damage = Math.ceil(attackInfo.damage * CONSTRICT_DAMAGE);
        const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
        const attackText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
        const joinText = attackInfo.damage > 0 ? __("and") : __("but");
        character.decreaseHp(attackInfo.damage);

        return [__(":sob: %s attacks you and constricts around you, dealing %s damage %s holding you immobilized!%s", this.getDisplayName(character), attackText, joinText, critText)];
      }, dodgeText, missText);
    }

    /**
     * Continue to constrict character.
     * On first turn, do 75% damage and character has 50% chance of breaking free.
     * On second turn, do 100% damage and character has 100% chance of breaking free.
     *
     * @param {Character} character - The character being constricted.
     *
     * @return {array} Messages describing the attack.
     */
    beConstricting(character) {
      let messages = [];

      let attackInfo = this.getEffectAttackInfo(character);
      let templateText = '';

      // 50% chance of breaking out on turn 1, definite break out on turn 2
      const stunnedTurns = character.getFlag(FLAGS.STUNNED_TURNS, 0);
      if ( (stunnedTurns === 2 && Random.between(1, 2) === 1) || (stunnedTurns === 1)) {
        character.clearFlag(FLAGS.STUNNED_TURNS);
        this.clearFlag(FLAG_IS_CONSTRICTING);
        templateText = ":sweat_smile: %s constricts you, dealing %s damage %s.%s But you manage to break free!";
      }
      else {
        templateText = ":sob: %s continues to constrict you, dealing %s damage %s holding you immobilized!%s";
      }

      attackInfo.damage = Math.ceil(attackInfo.damage * CONSTRICT_DAMAGE);
      const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
      const attackText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
      const joinText = attackInfo.damage > 0 ? __("and") : __("but");
      messages.push(__(templateText, this.getDisplayName(character), attackText, joinText, critText));
      character.decreaseHp(attackInfo.damage);

      return messages;
    }
  };
};

module.exports = {
  ConstrictAction
};