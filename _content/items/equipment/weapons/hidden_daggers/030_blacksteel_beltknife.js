"use strict";

const HiddenDaggers = require('@app/content/items/equipment/weapons/hidden_daggers');

class BlacksteelBeltknifeWeapon extends HiddenDaggers {
  constructor() {
    super({
      type: 'equipment-weapons-hidden_daggers-030_blacksteel_beltknife',
      displayName: __('Blacksteel Beltknife'),
      description: __("Blacksteel isn't the strongest metal - you wouldn't want to parry with it - but it hides in your belt especially well."),
      level: 30,
      minDamage: 45,
      maxDamage: 52,
      gold: 3000,
    });
  }
}

module.exports = BlacksteelBeltknifeWeapon;