"use strict";

const ArcaneArmour = require('@app/content/items/equipment/armour/arcane');

class EmpoweredWarRobeArmour extends ArcaneArmour {
  constructor() {
    super({
      type: 'equipment-armour-arcane-045_empowered_war_robe',
      displayName: __("Empowered War Robe"),
      description: __("Currents of energy course up this robe and down the sleeves, ready to augment any spells you cast."),
      level: 45,
      defence: 190,
      spellPower: 40,
      gold: 6250,
    });
  }
}

module.exports = EmpoweredWarRobeArmour;