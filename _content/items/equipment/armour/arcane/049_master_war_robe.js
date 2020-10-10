"use strict";

const ArcaneArmour = require('@app/content/items/equipment/armour/arcane');

class MasterWarRobeArmour extends ArcaneArmour {
  constructor() {
    super({
      type: 'equipment-armour-arcane-049_master_war_robe',
      displayName: __("Master War Robe"),
      description: __("When Arcane Masters take the field, entire armies tremble.  Don these robes to have the same effect on those you meet."),
      level: 49,
      defence: 230,
      spellPower: 50,
      gold: 7500,
    });
  }
}

module.exports = MasterWarRobeArmour;