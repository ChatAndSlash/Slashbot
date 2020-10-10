"use strict";

const Axes = require('@app/content/items/equipment/weapons/axes');

class LumberAxeWeapon extends Axes {
  constructor() {
    super({
      type: 'equipment-weapons-axes-020_lumber_axe',
      displayName: __('Lumber Axe'),
      description: __("Your average woodchoppin' axe, only put to more interesting purposes."),
      level: 20,
      minDamage: 18,
      maxDamage: 42,
      crit: 5,
      gold: 1250,
    });
  }
}

module.exports = LumberAxeWeapon;