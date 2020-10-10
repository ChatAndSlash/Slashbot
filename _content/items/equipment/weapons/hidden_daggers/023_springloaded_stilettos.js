"use strict";

const HiddenDaggers = require('@app/content/items/equipment/weapons/hidden_daggers');

class SpringloadedStilettosWeapon extends HiddenDaggers {
  constructor() {
    super({
      type: 'equipment-weapons-hidden_daggers-023_springloaded_stilettos',
      displayName: __('Springloaded Stilettos'),
      description: __("Simple, sharp blades that spring out from secret pockets sewn into your sleeves."),
      level: 23,
      minDamage: 33,
      maxDamage: 40,
      gold: 1500,
    });
  }
}

module.exports = SpringloadedStilettosWeapon;