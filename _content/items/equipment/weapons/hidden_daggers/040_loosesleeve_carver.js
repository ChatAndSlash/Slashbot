"use strict";

const HiddenDaggers = require('@app/content/items/equipment/weapons/hidden_daggers');

class LoosesleeveCarverWeapon extends HiddenDaggers {
  constructor() {
    super({
      type: 'equipment-weapons-hidden_daggers-040_loosesleeve_carver',
      displayName: __('Loosesleeve Carver'),
      description: __("Not an especially subtle knife, but it can be hidden in loose enough sleeves."),
      level: 40,
      minDamage: 63,
      maxDamage: 68,
      gold: 5000,
    });
  }
}

module.exports = LoosesleeveCarverWeapon;