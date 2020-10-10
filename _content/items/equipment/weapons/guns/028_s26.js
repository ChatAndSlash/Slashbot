"use strict";

const Gun = require('@app/content/items/equipment/weapons/guns');

class S26 extends Gun {
  constructor() {
    super({
      type: 'equipment-weapons-guns-028_s26',
      displayName: __('S26 "Righteous Expression"'),
      description: __('The S26 has is a pump-action shotgun which fires more quickly than other shotguns, though still pretty slowly.'),
      level: 28,
      minDamage: 19,
      maxDamage: 26,

      minAttacks: 1,
      maxAttacks: 3,
      maxAmmo: 8,

      gold: 2500,
    });
  }
}

module.exports = S26;