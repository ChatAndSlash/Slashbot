"use strict";

const mix              = require('mixwith').mix;
const Pet              = require('@app/content/items/equipment/pets');
const OptionalItemCost = require('@mixins/item/optional_item_cost').OptionalItemCost;
const Random           = require('@util/random');

class Midnight extends mix(Pet).with(OptionalItemCost('quest-pet_collar', 1)) {
  constructor() {
    super({
      type: 'equipment-pets-midnight',
      displayName: __('Midnight'),
      description: __('A tiny aloof black cat with mesmerizing eyes.'),
      shopText: __('Chance of healing during battle.'),
      gold: 500
    });
  }

  /**
   * 10% chance of healing 5% of character's health.
   *
   * @param {Character} character - The owner of the pet.
   *
   * @return {array} Messages generated.
   */
  doPetAction(character) {
    let messages = [];

    // 10% chance
    if (Random.between(1, 10) === 1) {
      const hp = Math.ceil(character.maxHp * 0.05);
      character.increaseHp(hp);

      return [__(":cat: Midnight purrs soothingly and you regain %s HP.", hp)];
    }

    return messages;
  }
}

module.exports = Midnight;