"use strict";

const HiddenDaggers = require('@app/content/items/equipment/weapons/hidden_daggers');

class SlenderSlicerWeapon extends HiddenDaggers {
  constructor() {
    super({
      type: 'equipment-weapons-hidden_daggers-028_slender_slicer',
      displayName: __('Slender Slicer'),
      description: __("This long, thin knife is easy to hide in many different locations.  Always keep 'em guessing."),
      level: 28,
      minDamage: 39,
      maxDamage: 51,
      gold: 2500,
    });
  }
}

module.exports = SlenderSlicerWeapon;