"use strict";

const HiddenDaggers = require('@app/content/items/equipment/weapons/hidden_daggers');

class LeafDaggerWeapon extends HiddenDaggers {
  constructor() {
    super({
      type: 'equipment-weapons-hidden_daggers-033_leaf_dagger',
      displayName: __('Leaf Dagger'),
      description: __("As thin as the blade of a leaf, this dagger can be hidden in many locations."),
      level: 33,
      minDamage: 48,
      maxDamage: 59,
      gold: 3500,
    });
  }
}

module.exports = LeafDaggerWeapon;