"use strict";

const HeavyArmour = require('@app/content/items/equipment/armour/heavy');

class FortifiedPlateArmour extends HeavyArmour {
  constructor() {
    super({
      type: 'equipment-armour-heavy-039_fortified_plate',
      displayName: __('Fortified Plate'),
      description: __("Armour from the past, fortified with the sturdiest of metals."),
      level: 39,
      defence: 210,
      dodge: 0,
      gold: 5250,
    });
  }
}

module.exports = FortifiedPlateArmour;