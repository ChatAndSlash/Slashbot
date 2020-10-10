"use strict";

const QuickArmour = require('@app/content/items/equipment/armour/quick');

class RapscallionLeatherArmour extends QuickArmour {
  constructor() {
    super({
      type: 'equipment-armour-quick-039_rapscallion_leather',
      displayName: __("Rapscallion Leather"),
      description: __("This armour looks like standard leather armour, but has all kinds of pockets and tricks - perfect for any sticky situations you may find yourself in."),
      level: 39,
      defence: 150,
      dodge: 5,
      gold: 5250,
    });
  }
}

module.exports = RapscallionLeatherArmour;