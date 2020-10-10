"use strict";

const Weapon = require('@app/content/items/equipment/weapons');

class BlackironMace extends Weapon {
  constructor() {
    super({
      type: 'equipment-weapons-019_blackiron_mace',
      displayName: __('Blackiron Mace'),
      description: __("Only the tip of this mace is made of Blackiron, but that's more than enough.  Blackiron is only medium-heavy, but astoundingly resistant once cooled, and so the awful spikes it was formed into will never dull or break."),
      level: 19,
      minDamage: 28,
      maxDamage: 35,
      gold: 1000,
    });
  }
}

module.exports = BlackironMace;