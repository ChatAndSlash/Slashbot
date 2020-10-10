"use strict";

const ArcaneArmour = require('@app/content/items/equipment/armour/arcane');

class SarcolineRobeArmour extends ArcaneArmour {
  constructor() {
    super({
      type: 'equipment-armour-arcane-037_sarcoline_robe',
      displayName: __("Sarcoline Robe"),
      description: __("This robe could be mistaken as see-through for people of a certain light skin tone.  Thankfully it glows with light, to disabuse anyone of that notion."),
      level: 37,
      defence: 135,
      spellPower: 28,
      gold: 4750,
    });
  }
}

module.exports = SarcolineRobeArmour;