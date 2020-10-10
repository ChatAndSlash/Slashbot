"use strict";

const Axes = require('@app/content/items/equipment/weapons/axes');

class MassiveChopperWeapon extends Axes {
  constructor() {
    super({
      type: 'equipment-weapons-axes-048_massive_chopper',
      displayName: __('Massive Chopper'),
      description: __("A preposterously large weapon."),
      level: 48,
      minDamage: 54,
      maxDamage: 88,
      crit: 5,
      gold: 6500,
    });
  }
}

module.exports = MassiveChopperWeapon;