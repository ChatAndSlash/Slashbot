"use strict";

const ArcaneArmour = require('@app/content/items/equipment/armour/arcane');

class GambogeRobeArmour extends ArcaneArmour {
  constructor() {
    super({
      type: 'equipment-armour-arcane-035_gamboge_robe',
      displayName: __("Gamboge Robe"),
      description: __("This robe is the colour of a deep yellow summer sunset, and faintly glows with the same."),
      level: 35,
      defence: 120,
      spellPower: 24,
      gold: 4250,
    });
  }
}

module.exports = GambogeRobeArmour;