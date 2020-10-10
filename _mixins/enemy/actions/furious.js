"use strict";

const { FLAGS, PROPERTIES } = require('@constants');

/**
 * Prepare for a round, then perform a furious attack for 2x damage.
 * Then become tired, which is exploitable.
 *
 * @param {integer} actionWeight - The chance to perform this attack out of 100.
 *
 * @return Mixin
 */
const FuriousAction = (actionWeight) => {
  return (Enemy) => class extends Enemy {
    constructor(info) {
      super(info);

      this.fightActionProperties.furiousAttack = [
        PROPERTIES.IS_ATTACK,
      ];
    }

    /**
     * If a fight action is forced due to status effects.
     *
     * @return {boolean}
     */
    isFightActionForced() {
      return this.hasFlag(FLAGS.IS_FURIOUS) || super.isFightActionForced();
    }

    /**
     * Get any fight actions this enemy is forced to make.
     *
     * @return {string}
     */
    getForcedFightAction() {
      if (this.hasFlag(FLAGS.IS_FURIOUS)) {
        return "furiousAttack";
      }

      return super.getForcedFightAction();
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
      actions.getFurious = actionWeight;

      return super.getFightActions(character, actions);
    }

    /**
     * Do nothing this turn, but get ready to do a furious attack next turn.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    getFurious(character) {
      this.setFlag(FLAGS.IS_FURIOUS);
      return [`${this.getDisplayName(character)} prepares to launch a furious attack!`];
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

      if (this.hasFlag(FLAGS.IS_FURIOUS)) {
        messages.push(`:rage: ${this.getDisplayName(opponent)} ${this.isAre} furious!`);
      }

      return messages;
    }

    /**
     * If this combatant should get tired after a Furious attack.
     *
     * @return boolean
     */
    shouldGetTired() {
      return true;
    }

    /**
     * Do a furious attack on the enemy, then be tired.
     *
     * @param {Character} character - The character being attacked.
     *
     * @return {array}
     */
    furiousAttack(character) {
      const dodgeText = ":dash: %s furiously attacks, but you dodge!";
      const missText = "%s furiously attacks, but misses!";

      let messages = this.attackHelper(character, (attackInfo) => {
        let messages = [];
        const displayName = this.getDisplayName(character);

        // Furious attacks do 2x damage
        attackInfo.damage *= 2;

        if (character.hasFlag(FLAGS.IS_RIPOSTING)) {
          if ( ! character.isAtRange(this)) {
            attackInfo.damage = Math.ceil(attackInfo.damage / 2);
          }
        }

        let critText   = attackInfo.didCrit && attackInfo.damage > 0 ? " _Critical hit!_" : "";
        let attackText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : "no";
        messages.push(`:frowning: ${displayName} furiously attacks, dealing ${attackText} damage to you.${critText}`);
        character.decreaseHp(attackInfo.damage);

        if (character.hasFlag(FLAGS.IS_RIPOSTING)) {
          if ( ! character.isAtRange(this)) {
            this.decreaseHp(attackInfo.damage);
            messages.push(`:grinning: You block half of ${displayName}'s furious attack and riposte, dealing ${attackText} damage back to them!`);
            character.clearFlag(FLAGS.IS_RIPOSTING);
          }
          else {
            messages.push("You can't riposte while outside of melee range.");
          }
        }

        return messages;
      }, dodgeText, missText);

      // No longer furious
      this.clearFlag(FLAGS.IS_FURIOUS);

      if (this.shouldGetTired()) {
        // But is tired
        this.setFlag(FLAGS.TIRED_TURNS, 2);
        messages.push(`:sleepy: ${this.getDisplayName(character)} has become tired from the furious attack.`);
      }
      else {
        messages.push(`:smiley: ${this.getDisplayName(character)} still seems bright-eyed and bushy-tailed after their furious attack.`);
      }

      return messages;
    }
  };
};

module.exports = {
  FuriousAction
};