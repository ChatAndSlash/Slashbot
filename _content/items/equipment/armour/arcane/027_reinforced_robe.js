"use strict";

const ArcaneArmour = require('@app/content/items/equipment/armour/arcane');

class ReinforcedRobeArmour extends ArcaneArmour {
  constructor() {
    super({
      type: 'equipment-armour-arcane-027_reinforced_robe',
      displayName: __("Reinforced Robe"),
      description: __('Taking a hint from other armour makers, this robe has leather patches sewn into it to improve its protection.'),
      level: 27,
      defence: 75,
      spellPower: 12,
      gold: 2750,
    });
  }
}

module.exports = ReinforcedRobeArmour;