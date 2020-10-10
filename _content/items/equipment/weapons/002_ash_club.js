"use strict";

const Weapon = require('@app/content/items/equipment/weapons');

class AshClub extends Weapon {
  constructor() {
    super({
      type: 'equipment-weapons-002_ash_club',
      displayName: __('Ash Club'),
      description: __('A harder wood makes a harder, heavier, and deadlier club.'),
      level: 2,
      minDamage: 5,
      maxDamage: 10,
      gold: 30,
    });
  }
}

module.exports = AshClub;