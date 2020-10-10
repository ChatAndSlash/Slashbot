"use strict";

const QuickArmour = require('@app/content/items/equipment/armour/quick');

class PaddedLeatherArmour extends QuickArmour {
  constructor() {
    super({
      type: 'equipment-armour-quick-022_padded_leather',
      displayName: __('Padded Leather'),
      description: __('This light leather armour has had extra padding to increase protection.  As a happy accident, it also makes it quite comfy!'),
      level: 22,
      defence: 55,
      dodge: 2,
      gold: 1750,
    });
  }
}

module.exports = PaddedLeatherArmour;