"use strict";

const QuickArmour = require('@app/content/items/equipment/armour/quick');

class DrakeLeatherArmour extends QuickArmour {
  constructor() {
    super({
      type: 'equipment-armour-quick-049_drake_leather',
      displayName: __("Drake Leather"),
      description: __("Drakes are very hard to find, and exceptionally hard to kill.  Their leather, it follows, is incredibly precious."),
      level: 49,
      defence: 230,
      dodge: 7,
      gold: 7500,
    });
  }
}

module.exports = DrakeLeatherArmour;