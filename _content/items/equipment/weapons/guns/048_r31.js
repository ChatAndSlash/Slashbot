"use strict";

const Gun = require('@app/content/items/equipment/weapons/guns');

class R31 extends Gun {
  constructor() {
    super({
      type: 'equipment-weapons-guns-048_r31',
      displayName: __('R31 "Sureshot"'),
      description: __("This gun is named a bit ironically, as you'll never be quite sure how many shots you'll be able to shoot."),
      level: 48,
      minDamage: 10,
      maxDamage: 22,

      minAttacks: 2,
      maxAttacks: 8,
      maxAmmo: 18,

      gold: 6500,
    });
  }
}

module.exports = R31;