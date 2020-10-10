"use strict";

const Gun = require('@app/content/items/equipment/weapons/guns');

class R29 extends Gun {
  constructor() {
    super({
      type: 'equipment-weapons-guns-040_r29',
      displayName: __('R29 "Staccato"'),
      description: __("The short, sharp reports of this rifle stand out as a warning on any battlefield."),
      level: 40,
      minDamage: 9,
      maxDamage: 15,

      minAttacks: 4,
      maxAttacks: 7,
      maxAmmo: 24,

      gold: 5000,
    });
  }
}

module.exports = R29;