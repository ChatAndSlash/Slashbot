"use strict";

const QuickArmour = require('@app/content/items/equipment/armour/quick');

class RogueLeatherArmour extends QuickArmour {
  constructor() {
    super({
      type: 'equipment-armour-quick-032_rogue_leather',
      displayName: __("Rogue Leather"),
      description: __("Tight-fitting, dark leather armour, designed for sneaking around in the dark."),
      level: 32,
      defence: 105,
      dodge: 4,
      gold: 3750,
    });
  }
}

module.exports = RogueLeatherArmour;