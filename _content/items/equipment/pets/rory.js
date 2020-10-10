"use strict";

const mix              = require('mixwith').mix;
const Pet              = require('@app/content/items/equipment/pets');
const Random           = require('@util/random');
const OptionalItemCost = require('@mixins/item/optional_item_cost').OptionalItemCost;

class Rory extends mix(Pet).with(OptionalItemCost('quest-pet_collar', 1)) {
  constructor() {
    super({
      type: 'equipment-pets-rory',
      displayName: __('Rory'),
      description: __('A very loud orange cat.'),
      shopText: __('Chance of attacking alongside you.'),
      gold: 500
    });
  }

  /**
   * 25% chance to do 10% HP damage.
   *
   * @param {Character} character - The owner of the pet.
   *
   * @return {array} Messages generated.
   */
  doPetAction(character) {
    let messages = [];

    // 25% chance
    if (Random.between(1, 4) === 1) {
      const enemy = character.enemy;

      // Can't attack a dead enemy
      if (enemy.hp > 0) {
        const hp = Math.ceil(enemy.maxHp / 10);
        const damage = enemy.decreaseHp(hp);

        return [__(":cat: Rory yowls shrilly, and %s takes %d damage!", enemy.getDisplayName(character), damage)];
      }
    }

    return messages;
  }
}

module.exports = Rory;