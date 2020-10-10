"use strict";

const QuickArmour = require('@app/content/items/equipment/armour/quick');

class BearLeatherArmour extends QuickArmour {
  constructor() {
    super({
      type: 'equipment-armour-quick-047_bear_leather',
      displayName: __("Bear Leather"),
      description: __("Bear leather has extra fur all over it, providing a layer to soften incoming blows, and keep you warm in all weathers."),
      level: 47,
      defence: 210,
      dodge: 7,
      gold: 6750,
    });
  }
}

module.exports = BearLeatherArmour;