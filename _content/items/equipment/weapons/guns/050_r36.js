"use strict";

const Gun = require('@app/content/items/equipment/weapons/guns');

class R36 extends Gun {
  constructor() {
    super({
      type: 'equipment-weapons-guns-050_r36',
      displayName: __('R36 "Bloody Stylus"'),
      description: __("The pen may be mightier than the sword, but a high-power rifle is mightier still than either."),
      level: 50,
      minDamage: 14,
      maxDamage: 22,

      minAttacks: 4,
      maxAttacks: 6,
      maxAmmo: 24,

      gold: 7000,
    });
  }
}

module.exports = R36;