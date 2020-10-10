"use strict";

const HiddenDaggers = require('@app/content/items/equipment/weapons/hidden_daggers');

class BeltBowieWeapon extends HiddenDaggers {
  constructor() {
    super({
      type: 'equipment-weapons-hidden_daggers-036_belt_bowie',
      displayName: __('Belt Bowie'),
      description: __("The blade of this knife hides down your pants, while the handle folds cleverly into the belt."),
      level: 36,
      minDamage: 55,
      maxDamage: 62,
      gold: 4000,
    });
  }
}

module.exports = BeltBowieWeapon;