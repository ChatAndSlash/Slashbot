"use strict";

const QuickArmour = require('@app/content/items/equipment/armour/quick');

class AlligatorLeatherArmour extends QuickArmour {
  constructor() {
    super({
      type: 'equipment-armour-quick-045_alligator_leather',
      displayName: __("Alligator Leather"),
      description: __("Alligator leather is tough, sturdy, and comands respect.  Someone, somewhere had to fight an alligator to craft this armour."),
      level: 45,
      defence: 190,
      dodge: 6,
      gold: 6250,
    });
  }
}

module.exports = AlligatorLeatherArmour;