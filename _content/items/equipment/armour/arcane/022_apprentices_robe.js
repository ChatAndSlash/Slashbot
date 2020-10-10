"use strict";

const ArcaneArmour = require('@app/content/items/equipment/armour/arcane');

class ApprenticesRobeArmour extends ArcaneArmour {
  constructor() {
    super({
      type: 'equipment-armour-arcane-022_apprentices_robe',
      displayName: __("Apprentice's Robe"),
      description: __('Light and airy, this robe carries a latent magical aura from the apprentice that crafted it.'),
      level: 22,
      defence: 55,
      spellPower: 4,
      gold: 1750,
    });
  }
}

module.exports = ApprenticesRobeArmour;