"use strict";

const Gun = require('@app/content/items/equipment/weapons/guns');

class R28 extends Gun {
  constructor() {
    super({
      type: 'equipment-weapons-guns-036_r28',
      displayName: __('R28 "Dancer"'),
      description: __("This rifle jerks and jumps in the hands, but makes up for the lack of accuracy with quantity."),
      level: 36,
      minDamage: 10,
      maxDamage: 16,

      minAttacks: 3,
      maxAttacks: 6,
      maxAmmo: 18,

      gold: 4000,
    });
  }
}

module.exports = R28;