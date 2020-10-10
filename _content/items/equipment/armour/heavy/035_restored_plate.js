"use strict";

const HeavyArmour = require('@app/content/items/equipment/armour/heavy');

class RestoredPlateArmour extends HeavyArmour {
  constructor() {
    super({
      type: 'equipment-armour-heavy-035_restored_plate',
      displayName: __('Restored Plate'),
      description: __("An old, old set of armour, restored lovingly with modern techniques."),
      level: 35,
      defence: 170,
      dodge: 0,
      gold: 4250,
    });
  }
}

module.exports = RestoredPlateArmour;