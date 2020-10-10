"use strict";

const ArcaneArmour = require('@app/content/items/equipment/armour/arcane');

class RunedRobeArmour extends ArcaneArmour {
  constructor() {
    super({
      type: 'equipment-armour-arcane-029_runed_robe',
      displayName: __("Runed Robe"),
      description: __('Small, lightly-glowing protective runes are inscribed along the edges of this robe.'),
      level: 29,
      defence: 90,
      spellPower: 16,
      gold: 3250,
    });
  }
}

module.exports = RunedRobeArmour;