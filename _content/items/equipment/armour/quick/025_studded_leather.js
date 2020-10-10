"use strict";

const QuickArmour = require('@app/content/items/equipment/armour/quick');

class StuddedLeatherArmour extends QuickArmour {
  constructor() {
    super({
      type: 'equipment-armour-quick-025_studded_leather',
      displayName: __('Studded Leather'),
      description: __('While still quite light and comfortable to wear, this armour is reinforced with metal studs to help deflect bladed weapons.'),
      level: 25,
      defence: 65,
      dodge: 2,
      gold: 2250,
    });
  }
}

module.exports = StuddedLeatherArmour;