"use strict";

const Gun = require('@app/content/items/equipment/weapons/guns');

class S22 extends Gun {
  constructor() {
    super({
      type: 'equipment-weapons-guns-023_s22',
      displayName: __('S22 "Justifier"'),
      description: __('This double-barrel shotgun packs a whallop, even though its rate of fire is pretty awful.'),
      level: 23,
      minDamage: 22,
      maxDamage: 27,

      minAttacks: 1,
      maxAttacks: 2,
      maxAmmo: 6,

      gold: 1500,
    });
  }
}

module.exports = S22;