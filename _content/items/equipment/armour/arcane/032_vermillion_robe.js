"use strict";

const ArcaneArmour = require('@app/content/items/equipment/armour/arcane');

class VermillionRobeArmour extends ArcaneArmour {
  constructor() {
    super({
      type: 'equipment-armour-arcane-032_vermillion_robe',
      displayName: __("Vermillion Robe"),
      description: __("A brilliant scarlet robe that emanates a subtle aura of power."),
      level: 32,
      defence: 105,
      spellPower: 20,
      gold: 3750,
    });
  }
}

module.exports = VermillionRobeArmour;