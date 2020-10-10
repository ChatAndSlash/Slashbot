"use strict";

const Axes = require('@app/content/items/equipment/weapons/axes');

class StuddedHatchetWeapon extends Axes {
  constructor() {
    super({
      type: 'equipment-weapons-axes-026_studded_hatchet',
      displayName: __('Studded Hatchet'),
      description: __("This hatchet is light and deadly, with a studded grip to ensure you don't lose your grip even during the most violent of swings."),
      level: 26,
      minDamage: 23,
      maxDamage: 51,
      crit: 5,
      gold: 2000,
    });
  }
}

module.exports = StuddedHatchetWeapon;