"use strict";

const QuickArmour = require('@app/content/items/equipment/armour/quick');

class SturdyLeatherArmour extends QuickArmour {
  constructor() {
    super({
      type: 'equipment-armour-quick-029_sturdy_leather',
      displayName: __('Sturdy Leather'),
      description: __('Thin metal plates have been inserted in between leather sections to beef up the protection for the vital areas of this armour.'),
      level: 29,
      defence: 90,
      dodge: 3,
      gold: 3250,
    });
  }
}

module.exports = SturdyLeatherArmour;