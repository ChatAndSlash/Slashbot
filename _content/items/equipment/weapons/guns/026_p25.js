"use strict";

const Gun = require('@app/content/items/equipment/weapons/guns');

class P25 extends Gun {
  constructor() {
    super({
      type: 'equipment-weapons-guns-026_p25',
      displayName: __('P25 "Final Phrase"'),
      description: __('This double-action revolver can fire powerful shots rather quickly.'),
      level: 26,
      minDamage: 14,
      maxDamage: 19,

      minAttacks: 2,
      maxAttacks: 3,
      maxAmmo: 6,

      gold: 2000,
    });
  }
}

module.exports = P25;