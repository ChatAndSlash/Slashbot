"use strict";

const mix              = require('mixwith').mix;
const Pet              = require('@app/content/items/equipment/pets');
const Random           = require('@util/random');
const OptionalItemCost = require('@mixins/item/optional_item_cost').OptionalItemCost;

const FLAGS = require('@constants').FLAGS;

class Lancelot extends mix(Pet).with(OptionalItemCost('quest-pet_collar', 1)) {
  constructor() {
    super({
      type: 'equipment-pets-lancelot',
      displayName: __('Lancelot'),
      description: __('A protective, fluffy grey cat.'),
      shopText: __('Chance to stun opponent.'),
      gold: 500
    });
  }

  /**
   * 5% chance of stun for 1 turn.
   *
   * @param {Character} character - The owner of the pet.
   *
   * @return {array} Messages generated.
   */
  doPetAction(character) {
    let messages = [];

    // 5% chance
    if (Random.between(1, 20) === 1) {
      const enemy = character.enemy;

      // Can't stun a dead enemy and shouldn't stun a furious one
      if (enemy.hp > 0 && ! enemy.hasFlag(FLAGS.IS_FURIOUS)) {
        enemy.setFlag(FLAGS.STUNNED_TURNS, 1);

        return [__(":cat: Lancelot headbutts %s so fiercely it is stunned for 1 turn.", enemy.getDisplayName(character))];
      }
    }

    return messages;
  }
}

module.exports = Lancelot;