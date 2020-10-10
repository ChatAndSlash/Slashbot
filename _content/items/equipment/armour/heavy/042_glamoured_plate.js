"use strict";

const HeavyArmour = require('@app/content/items/equipment/armour/heavy');

class GlamouredPlateArmour extends HeavyArmour {
  constructor() {
    super({
      type: 'equipment-armour-heavy-042_glamoured_plate',
      displayName: __('Glamoured Plate'),
      description: __("This plate armour has a light glamour on it, so the wearer seems to be at a slightly different position than they are."),
      level: 42,
      defence: 235,
      dodge: 0,
      gold: 5750,
    });
  }
}

module.exports = GlamouredPlateArmour;