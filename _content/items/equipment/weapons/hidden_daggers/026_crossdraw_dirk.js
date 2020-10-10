"use strict";

const HiddenDaggers = require('@app/content/items/equipment/weapons/hidden_daggers');

class CrossdrawDirkWeapon extends HiddenDaggers {
  constructor() {
    super({
      type: 'equipment-weapons-hidden_daggers-026_crossdraw_dirk',
      displayName: __('Crossdraw Dirk'),
      description: __("This dagger is designed to be pulled with one hand from the sleeve of the opposite hand, and swung in a broad, deadly arc."),
      level: 26,
      minDamage: 35,
      maxDamage: 48,
      gold: 2000,
    });
  }
}

module.exports = CrossdrawDirkWeapon;