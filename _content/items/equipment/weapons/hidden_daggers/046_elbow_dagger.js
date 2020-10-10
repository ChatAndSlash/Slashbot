"use strict";

const HiddenDaggers = require('@app/content/items/equipment/weapons/hidden_daggers');

class ElbowDaggerWeapon extends HiddenDaggers {
  constructor() {
    super({
      type: 'equipment-weapons-hidden_daggers-046_elbow_dagger',
      displayName: __('Elbow Dagger'),
      description: __("Designed to be strapped to the upper arm and drawn from the elbow, this dagger is easily drawn and replaced in a flash."),
      level: 46,
      minDamage: 72,
      maxDamage: 79,
      gold: 6000,
    });
  }
}

module.exports = ElbowDaggerWeapon;