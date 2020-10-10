"use strict";

const ArcaneArmour = require('@app/content/items/equipment/armour/arcane');

class ExarchWarRobeArmour extends ArcaneArmour {
  constructor() {
    super({
      type: 'equipment-armour-arcane-047_exarch_war_robe',
      displayName: __("Exarch War Robe"),
      description: __("Robes typically given to Arcane College Exarchs, they can also be found on the market for the right price."),
      level: 47,
      defence: 210,
      spellPower: 44,
      gold: 6750,
    });
  }
}

module.exports = ExarchWarRobeArmour;