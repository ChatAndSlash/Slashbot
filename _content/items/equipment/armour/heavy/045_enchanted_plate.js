"use strict";

const HeavyArmour = require('@app/content/items/equipment/armour/heavy');

class EnchantedPlateArmour extends HeavyArmour {
  constructor() {
    super({
      type: 'equipment-armour-heavy-045_enchanted_plate',
      displayName: __('Enchanted Plate'),
      description: __("A light blue ripple of energy courses across this armour, magical energies adding an extra level of protection."),
      level: 45,
      defence: 260,
      dodge: 0,
      gold: 6250,
    });
  }
}

module.exports = EnchantedPlateArmour;