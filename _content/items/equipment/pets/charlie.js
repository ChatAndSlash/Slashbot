"use strict";

const mix       = require('mixwith').mix;
const Pet       = require('@app/content/items/equipment/pets');
const Random    = require('@util/random');
const ScaleCost = require('@mixins/item/scale_cost').ScaleCost;

class Charlie extends mix(Pet).with(ScaleCost(50)) {
  constructor() {
    super({
      type: 'equipment-pets-charlie',
      displayName: __('Charlie'),
      shopText: __('A lively Golden Mink that provides light in the darkness and occasionally finds bonus gold on defeated enemies.'),
      description: __('A Golden Mink that gives off a soft glow.'),
      providesLight: true
    });
  }

  /**
   * Perform any post-fight success actions and return the messages arising from them.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Messages that have already been generated.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    messages = super.doFightSuccess(character, messages);

    if (this.shouldFindGold()) {
      const gold = this.getExtraGold(character.enemy);
      character.gold += (gold);
      messages.push(__("Charlie digs excitedly nearby, uncovering an extra %d gold that you missed!", gold));
    }

    return messages;
  }

  /**
   * Determines the extra gold to award.
   *
   * @param {Enemy} enemy - The enemy to determine the extra gold for.
   *
   * @return integer
   */
  getExtraGold(enemy) {
    return Math.ceil(Random.between(enemy.goldMin, enemy.goldMax) / 10);
  }

  /**
   * Has a 50% chance of finding gold.
   */
  shouldFindGold() {
    return Random.between(1, 2);
  }
}

module.exports = Charlie;