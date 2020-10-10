"use strict";

const Gun = require('@app/content/items/equipment/weapons/guns');

class S40 extends Gun {
  constructor() {
    super({
      type: 'equipment-weapons-guns-043_s40',
      displayName: __('S40 "Big Bada Boom"'),
      description: __("It may look small and cute, but it packs a big bada punch."),
      level: 43,
      minDamage: 32,
      maxDamage: 39,

      minAttacks: 1,
      maxAttacks: 3,
      maxAmmo: 8,

      gold: 5500,
    });
  }
}

module.exports = S40;