"use strict";

const ArcaneArmour = require('@app/content/items/equipment/armour/arcane');

class EmbroideredRobeArmour extends ArcaneArmour {
  constructor() {
    super({
      type: 'equipment-armour-arcane-025_embroidered_robe',
      displayName: __("Embroidered Robe"),
      description: __('The thread used for the embroidery on this gorgeous robe has been enchanted to increase protection.'),
      level: 25,
      defence: 65,
      spellPower: 8,
      gold: 2250,
    });
  }
}

module.exports = EmbroideredRobeArmour;