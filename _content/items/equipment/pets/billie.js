"use strict";

const mix       = require('mixwith').mix;
const Pet       = require('@app/content/items/equipment/pets');
const Random    = require('@util/random');
const ScaleCost = require('@mixins/item/scale_cost').ScaleCost;

const FLAGS        = require('@constants').FLAGS;
const BURN_BONUS   = require('@constants').BURN_BONUS;

const BURNED_TURNS = 6;

class Billie extends mix(Pet).with(ScaleCost(50)) {
  constructor() {
    super({
      type: 'equipment-pets-billie',
      displayName: __('Billie'),
      shopText: __('A Flame Ferret which will occasionally attack and burn your opponent.'),
      description: __('This Flame Ferret is actually a rescue.  He used to be a team mascot, but the team was disbanded over infighting.'),
    });
  }

  /**
   * 25% chance of attacking for 8% damage + inflicting burn.
   *
   * @param {Character} character - The owner of the pet.
   *
   * @return {array} Messages generated.
   */
  doPetAction(character) {
    let messages = [];
    let enemy = character.enemy;

    if (this.shouldAttack() && enemy.hp > 0) {
      let hp = Math.ceil(enemy.maxHp * 0.08);

      if (enemy.hasFlag(FLAGS.BURNED_TURNS)) {
        hp = Math.ceil(hp * BURN_BONUS);
      }

      const damage = enemy.decreaseHp(hp);
      messages.push(__("Billie darts forward and nips excitedly at %s's heels!  More damaging though, is his flaming breath, which does *%d* damage!", enemy.getDisplayName(character), damage));

      if (enemy.hasFlag(FLAGS.BURNED_TURNS)) {
        messages.push(__(":fire: %s is burned and takes extra damage from your burn attack!", enemy.getDisplayName(character)));
      }

      messages = messages.concat(enemy.addStatusBurned(BURNED_TURNS));
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

module.exports = Billie;