"use strict";

const HiddenDaggers = require('@app/content/items/equipment/weapons/hidden_daggers');

class PocketPenknifeWeapon extends HiddenDaggers {
  constructor() {
    super({
      type: 'equipment-weapons-hidden_daggers-043_pocket_penknife',
      displayName: __('Pocket Penknife'),
      description: __("Not an especially mighty blade, but deadly enough in the right hands."),
      level: 43,
      minDamage: 68,
      maxDamage: 73,
      gold: 5500,
    });
  }
}

module.exports = PocketPenknifeWeapon;