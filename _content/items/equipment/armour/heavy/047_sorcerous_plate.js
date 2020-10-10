"use strict";

const HeavyArmour = require('@app/content/items/equipment/armour/heavy');

class SorcerousPlateArmour extends HeavyArmour {
  constructor() {
    super({
      type: 'equipment-armour-heavy-047_sorcerous_plate',
      displayName: __('Sorcerous Plate'),
      description: __("Although it looks like a standard set of plate armour, magical energies coalesce in front of any attacks, defending the wearer exquisitely."),
      level: 47,
      defence: 285,
      dodge: 0,
      gold: 6750,
    });
  }
}

module.exports = SorcerousPlateArmour;