"use strict";

const Axes = require('@app/content/items/equipment/weapons/axes');

class CruelHandaxeWeapon extends Axes {
  constructor() {
    super({
      type: 'equipment-weapons-axes-023_cruel_handaxe',
      displayName: __('Cruel Handaxe'),
      description: __("A small axe with a long spike on top, useful for stabbing _or_ slicing."),
      level: 23,
      minDamage: 20,
      maxDamage: 47,
      crit: 5,
      gold: 1500,
    });
  }
}

module.exports = CruelHandaxeWeapon;