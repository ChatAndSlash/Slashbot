"use strict";

const QuickArmour = require('@app/content/items/equipment/armour/quick');

class ScoundrelLeatherArmour extends QuickArmour {
  constructor() {
    super({
      type: 'equipment-armour-quick-037_scoundrel_leather',
      displayName: __("Scoundrel Leather"),
      description: __("Impressive to even the most hardened of thieves, this armour inspires fear in unsavoury types."),
      level: 37,
      defence: 135,
      dodge: 5,
      gold: 4750,
    });
  }
}

module.exports = ScoundrelLeatherArmour;