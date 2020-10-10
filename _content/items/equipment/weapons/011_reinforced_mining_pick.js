"use strict";

const Weapon = require('@app/content/items/equipment/weapons');

class ReinforcedHorsemansPick extends Weapon {
  constructor() {
    super({
      type: 'equipment-weapons-011_reinforced_mining_pick',
      displayName: __('Reinforced Mining Pick'),
      description: __('While intended originally for mining, this pick has been reinforced and hardened so that it can swing directly through most armour, and following that, flesh and bone.'),
      level: 11,
      minDamage: 20,
      maxDamage: 26,
      gold: 500,
    });
  }
}

module.exports = ReinforcedHorsemansPick;