"use strict";

const Gun = require('@app/content/items/equipment/weapons/guns');

class S32 extends Gun {
  constructor() {
    super({
      type: 'equipment-weapons-guns-033_s32',
      displayName: __('S32 "Nightbreak"'),
      description: __("The powerful sound of this shotgun can tear apart the silence of an otherwise quiet night."),
      level: 33,
      minDamage: 46,
      maxDamage: 60,

      minAttacks: 1,
      maxAttacks: 1,
      maxAmmo: 2,

      gold: 3500,
    });
  }
}

module.exports = S32;