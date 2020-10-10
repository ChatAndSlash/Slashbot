"use strict";

const QuickArmour = require('@app/content/items/equipment/armour/quick');

class RascalLeatherArmour extends QuickArmour {
  constructor() {
    super({
      type: 'equipment-armour-quick-035_rascal_leather',
      displayName: __("Rascal Leather"),
      description: __("Designed to look as close as possible to standard street clothing, this leather armour allows you to blend in with a crowd."),
      level: 35,
      defence: 120,
      dodge: 4,
      gold: 4250,
    });
  }
}

module.exports = RascalLeatherArmour;