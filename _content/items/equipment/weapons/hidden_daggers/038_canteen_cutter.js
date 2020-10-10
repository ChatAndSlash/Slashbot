"use strict";

const HiddenDaggers = require('@app/content/items/equipment/weapons/hidden_daggers');

class CanteenCutterWeapon extends HiddenDaggers {
  constructor() {
    super({
      type: 'equipment-weapons-hidden_daggers-038_canteen_cutter',
      displayName: __('Canteen Cutter'),
      description: __("Seems like an innocent drinking canteen, right?  Nope, it hides a sharp, deadly blade!"),
      level: 38,
      minDamage: 59,
      maxDamage: 65,
      gold: 4500,
    });
  }
}

module.exports = CanteenCutterWeapon;