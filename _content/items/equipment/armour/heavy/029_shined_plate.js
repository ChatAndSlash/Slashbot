"use strict";

const HeavyArmour = require('@app/content/items/equipment/armour/heavy');

class ShinedPlateArmour extends HeavyArmour {
  constructor() {
    super({
      type: 'equipment-armour-heavy-029_shined_plate',
      displayName: __('Shined Plate'),
      description: __('So bright and shiny, you wouldn\'t know it\'s used!'),
      level: 29,
      defence: 130,
      dodge: 0,
      gold: 3250,
    });
  }
}

module.exports = ShinedPlateArmour;