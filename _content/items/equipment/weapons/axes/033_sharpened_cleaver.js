"use strict";

const Axes = require('@app/content/items/equipment/weapons/axes');

class SharpenedCleaverWeapon extends Axes {
  constructor() {
    super({
      type: 'equipment-weapons-axes-033_sharpened_cleaver',
      displayName: __('Sharpened Cleaver'),
      description: __("Essentially an extra-sharp, over-large cooking cleaver, this functions equally well for fighting."),
      level: 33,
      minDamage: 35,
      maxDamage: 60,
      crit: 5,
      gold: 3500,
    });
  }
}

module.exports = SharpenedCleaverWeapon;