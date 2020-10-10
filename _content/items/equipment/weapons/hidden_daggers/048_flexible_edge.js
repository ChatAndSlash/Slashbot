"use strict";

const HiddenDaggers = require('@app/content/items/equipment/weapons/hidden_daggers');

class FlexibleEdgeWeapon extends HiddenDaggers {
  constructor() {
    super({
      type: 'equipment-weapons-hidden_daggers-048_flexible_edge',
      displayName: __('Flexible Edge'),
      description: __("This blade can be hidden nearly anywhere on the body, as it curves and flexes with ease."),
      level: 48,
      minDamage: 76,
      maxDamage: 82,
      gold: 6500,
    });
  }
}

module.exports = FlexibleEdgeWeapon;