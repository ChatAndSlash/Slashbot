"use strict";

const HiddenDaggers = require('@app/content/items/equipment/weapons/hidden_daggers');

class CarvingKnivesWeapon extends HiddenDaggers {
  constructor() {
    super({
      type: 'equipment-weapons-hidden_daggers-020_carving_knives',
      displayName: __('Carving Knives'),
      description: __("Nobody suspects the humble carving knife!"),
      level: 20,
      minDamage: 30,
      maxDamage: 38,
      gold: 1250,
    });
  }
}

module.exports = CarvingKnivesWeapon;