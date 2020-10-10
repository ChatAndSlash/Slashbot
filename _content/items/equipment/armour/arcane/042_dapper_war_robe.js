"use strict";

const ArcaneArmour = require('@app/content/items/equipment/armour/arcane');

class DapperWarRobeArmour extends ArcaneArmour {
  constructor() {
    super({
      type: 'equipment-armour-arcane-042_dapper_war_robe',
      displayName: __("Dapper War Robe"),
      description: __("You'll look your best on the battlefield with this finely-tailor battle armour."),
      level: 42,
      defence: 170,
      spellPower: 36,
      gold: 5750,
    });
  }
}

module.exports = DapperWarRobeArmour;