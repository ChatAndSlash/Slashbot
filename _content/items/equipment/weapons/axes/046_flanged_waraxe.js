"use strict";

const Axes = require('@app/content/items/equipment/weapons/axes');

class FlangedWaraxeWeapon extends Axes {
  constructor() {
    super({
      type: 'equipment-weapons-axes-046_flanged_waraxe',
      displayName: __('Flanged Waraxe'),
      description: __("The blade of this axe is as sharp as ever, but the flange allows for extra weight for increased penetrative power."),
      level: 46,
      minDamage: 49,
      maxDamage: 85,
      crit: 5,
      gold: 6000,
    });
  }
}

module.exports = FlangedWaraxeWeapon;