"use strict";

const Axes = require('@app/content/items/equipment/weapons/axes');

class HeavyHackerWeapon extends Axes {
  constructor() {
    super({
      type: 'equipment-weapons-axes-036_heavy_hacker',
      displayName: __('Heavy Hacker'),
      description: __("Little more than a massive chunk of semi-sharp metal, it still hurts when you get hit with it."),
      level: 36,
      minDamage: 36,
      maxDamage: 66,
      crit: 5,
      gold: 4000,
    });
  }
}

module.exports = HeavyHackerWeapon;