"use strict";

const Weapon = require('@app/content/items/equipment/weapons');

class PineClub extends Weapon {
  constructor() {
    super({
      type: 'equipment-weapons-001_pine_club',
      displayName: __('Pine Club'),
      description: __('A club made of pine, not especially hard, but easy to make or find.'),
      minDamage: 3,
      maxDamage: 8,
      gold: 0,
    });
  }
}

module.exports = PineClub;