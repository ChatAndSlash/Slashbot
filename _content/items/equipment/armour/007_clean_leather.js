"use strict";

const Armour = require('@app/content/items/equipment/armour');

class CleanLeatherArmour extends Armour {
  constructor() {
    super({
      type: 'equipment-armour-007_clean_leather',
      displayName: __('Clean Leather'),
      description: __('Fresh clean leather armour, never worn before.'),
      level: 7,
      defence: 20,
      dodge: 0,
      gold: 125,
    });
  }
}

module.exports = CleanLeatherArmour;