"use strict";

const { STATS, REPUTATION_LEVELS } = require('@constants');

/**
 * Rewards an amount of Watermoon Reputation.
 *
 * @param {integer} amount - The amount of reputation gained.
 *
 * @return {Mixin}
 */
const WatermoonReputation = (amount) => {
  return (Enemy) => class extends Enemy {
    /**
     * Special actions to take when this enemy has been beaten.
     *
     * NOTE: Any additionally enqueued messages NEED a delay in order to ensure they show up after
     * the action fight message.
     *
     * @param {Character} character - The character who won the fight.
     * @param {array} messages - Any messages that have happened so far in combat.
     *
     * @return {array}
     */
    doFightSuccess(character, messages) {
      const modifiedAmount = character.inventory.has('reputation-doublehead_coin')
        ? amount * 2
        : amount;

      const current = character.getStat(STATS.REPUTATION_GAINED, STATS.WATERMOON_REPUTATION);
      const increase = Math.min(REPUTATION_LEVELS.ESTEEMED - current, modifiedAmount);

      if (increase > 0) {
        character.increaseStat(STATS.REPUTATION_GAINED, increase, STATS.WATERMOON_REPUTATION);

        messages = messages.concat([__(":speaking_head_in_silhouette: You gained %d Watermoon reputation, and have a total of %d.", increase, current + increase)]);
        messages = messages.concat(this.getReputationLevelUpText(current, current + increase));
      }

      return super.doFightSuccess(character, messages);
    }

    /**
     * Gets the text for leveling up a reputation level, if any.
     *
     * @param {Character} character - The character gaining reputation.
     *
     * @return [string]
     */
    getReputationLevelUpText(before, after) {
      let messages = [];

      if (after >= REPUTATION_LEVELS.ESTEEMED && before < REPUTATION_LEVELS.ESTEEMED) {
        messages.push(__(":star-struck: You have earned sufficient reputation to become `Esteemed` with Watermoon.  Visit Aureth to purchase something special!"));
      }
      else if (after >= REPUTATION_LEVELS.RESPECTED && before < REPUTATION_LEVELS.RESPECTED) {
        messages.push(__(":star-struck: You have earned sufficient reputation to become `Respected` with Watermoon.  Visit Aureth to purchase boosts to help you accomplish your goals quicker."));
      }
      else if (after >= REPUTATION_LEVELS.APPRECIATED && before < REPUTATION_LEVELS.APPRECIATED) {
        messages.push(__(":star-struck: You have earned sufficient reputation to become `Appreciated` with Watermoon.  Visit Aureth to purchase boosts to increase your Defence and Spell Power."));

      }
      else if (after >= REPUTATION_LEVELS.KNOWN && before < REPUTATION_LEVELS.KNOWN) {
        messages.push(__(":star-struck: You have earned sufficient reputation to become `Known` with Watermoon.  Visit Aureth to purchase boosts to increase your Technique and Force."));
      }

      return messages;
    }
  };
};

module.exports = {
  WatermoonReputation
};