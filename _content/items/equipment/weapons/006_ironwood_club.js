"use strict";

const Weapon = require('@app/content/items/equipment/weapons');

class IronwoodClub extends Weapon {
  constructor() {
    super({
      type: 'equipment-weapons-006_ironwood_club',
      displayName: __('Ironwood Club'),
      description: __('Ironwood is heavily sought after for its incredible hardness, marking this club as a rare and powerful weapon.'),
      level: 6,
      minDamage: 11,
      maxDamage: 18,
      gold: 100,
    });
  }
}

module.exports = IronwoodClub;