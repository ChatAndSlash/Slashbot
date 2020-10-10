"use strict";

const Gun = require('@app/content/items/equipment/weapons/guns');

class P28 extends Gun {
  constructor() {
    super({
      type: 'equipment-weapons-guns-030_p28',
      displayName: __('P28 "Quarrel Ender"'),
      description: __('Put an end to any and all of your troublesome quarrels with the P28, the first pistol to feature auto-loading technology.'),
      level: 30,
      minDamage: 10,
      maxDamage: 14,

      minAttacks: 3,
      maxAttacks: 5,
      maxAmmo: 15,

      gold: 3000,
    });
  }
}

module.exports = P28;