"use strict";

const Axes = require('@app/content/items/equipment/weapons/axes');

class TheCarverWeapon extends Axes {
  constructor() {
    super({
      type: 'equipment-weapons-axes-038_the_carver',
      displayName: __('The Carver'),
      description: __("While not huge or heavy, this axe is sharp and shapely and can easily cleave off hunks of your opponents."),
      level: 38,
      minDamage: 42,
      maxDamage: 67,
      crit: 5,
      gold: 4500,
    });
  }
}

module.exports = TheCarverWeapon;