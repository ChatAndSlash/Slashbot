"use strict";

const Armour = require('@app/content/items/equipment/armour');

class PatchedLeatherArmour extends Armour {
  constructor() {
    super({
      type: 'equipment-armour-005_patched_leather',
      displayName: __('Patched Leather'),
      description: __('Old leather armour with all the rents and tears patched up.'),
      level: 5,
      defence: 15,
      dodge: 0,
      gold: 75,
    });
  }
}

module.exports = PatchedLeatherArmour;