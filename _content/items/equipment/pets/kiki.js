"use strict";

const mix       = require('mixwith').mix;
const Pet       = require('@app/content/items/equipment/pets');
const Random    = require('@util/random');
const ScaleCost = require('@mixins/item/scale_cost').ScaleCost;

const CHILLED_TURNS = 10;

class Kiki extends mix(Pet).with(ScaleCost(50)) {
  constructor() {
    super({
      type: 'equipment-pets-kiki',
      displayName: __('Kiki'),
      shopText: __('A fiesty Water Otter who can chill your opponents when she attacks.'),
      description: __('This squirmy, playful Water Otter has an ice-cold bite, which can get tricky when she gets playful.'),
    });
  }

  /**
   * 25% chance of attacking for 8% damage + inflicting chill.
   *
   * @param {Character} character - The owner of the pet.
   *
   * @return {array} Messages generated.
   */
  doPetAction(character) {
    let messages = [];
    let enemy = character.enemy;

    if (this.shouldAttack() && enemy.hp > 0) {
      const hp = Math.ceil(enemy.maxHp * 0.08);
      const damage = enemy.decreaseHp(hp);

      messages.push(__("Kiki bares her frosty teeth and attacks %s for *%d* damage!", enemy.getDisplayName(character), damage));

      messages = messages.concat(enemy.addStatusChilled(CHILLED_TURNS));
    }

    return messages;
  }

  /**
   * 25% chance of attacking.
   *
   * @return boolean
   */
  shouldAttack() {
    return Random.between(1, 4) === 1;
  }
}

module.exports = Kiki;