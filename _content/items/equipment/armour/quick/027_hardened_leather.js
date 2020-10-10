"use strict";

const QuickArmour = require('@app/content/items/equipment/armour/quick');

class HardenedLeatherArmour extends QuickArmour {
  constructor() {
    super({
      type: 'equipment-armour-quick-027_hardened_leather',
      displayName: __('Hardened Leather'),
      description: __('This armour has been boiled alongside curing chemicals, hardening the more vital areas and providing more protection.'),
      level: 27,
      defence: 75,
      dodge: 3,
      gold: 2750,
    });
  }
}

module.exports = HardenedLeatherArmour;