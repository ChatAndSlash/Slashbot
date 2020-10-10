"use strict";

const Weapon = require('@app/content/items/equipment/weapons');

class OakClub extends Weapon {
  constructor() {
    super({
      type: 'equipment-weapons-004_oak_club',
      displayName: __('Oak Club'),
      description: __('Oak is a very hard wood, making this club very powerful.'),
      level: 4,
      minDamage: 7,
      maxDamage: 12,
      gold: 50,
    });
  }
}

module.exports = OakClub;