"use strict";

const Axes = require('@app/content/items/equipment/weapons/axes');

class SpikedWaraxeWeapon extends Axes {
  constructor() {
    super({
      type: 'equipment-weapons-axes-030_spiked_waraxe',
      displayName: __('Spiked Waraxe'),
      description: __("A tall spike extends from the top of this waraxe, allowing the weilder to stab or chop as the situation warrants."),
      level: 30,
      minDamage: 30,
      maxDamage: 58,
      crit: 5,
      gold: 3000,
    });
  }
}

module.exports = SpikedWaraxeWeapon;