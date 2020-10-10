"use strict";

const HiddenDaggers = require('@app/content/items/equipment/weapons/hidden_daggers');

class InvisibleBladesWeapon extends HiddenDaggers {
  constructor() {
    super({
      type: 'equipment-weapons-hidden_daggers-050_invisible_blades',
      displayName: __('Invisible Blades'),
      description: __("When turned sideways, these blades are so thin as to be effectively invisible, allowing them to be hidden in thin air."),
      level: 50,
      minDamage: 85,
      maxDamage: 90,
      gold: 7000,
    });
  }
}

module.exports = InvisibleBladesWeapon;