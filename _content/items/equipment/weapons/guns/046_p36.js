"use strict";

const Gun = require('@app/content/items/equipment/weapons/guns');

class P36 extends Gun {
  constructor() {
    super({
      type: 'equipment-weapons-guns-046_p36',
      displayName: __('P36 "Triple-Tap"'),
      description: __("Why settle for one devastating shot, when you can shoot three?"),
      level: 46,
      minDamage: 22,
      maxDamage: 29,

      minAttacks: 3,
      maxAttacks: 3,
      maxAmmo: 12,

      gold: 6000,
    });
  }
}

module.exports = P36;