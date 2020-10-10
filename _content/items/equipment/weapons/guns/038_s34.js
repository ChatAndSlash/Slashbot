"use strict";

const Gun = require('@app/content/items/equipment/weapons/guns');

class S34 extends Gun {
  constructor() {
    super({
      type: 'equipment-weapons-guns-038_s34',
      displayName: __('S34 "Roar of Death"'),
      description: __("The roar of this gun may end up being the last thing your opponent ever hears."),
      level: 38,
      minDamage: 35,
      maxDamage: 48,

      minAttacks: 1,
      maxAttacks: 2,
      maxAmmo: 6,

      gold: 4500,
    });
  }
}

module.exports = S34;