"use strict";

const HeavyArmour = require('@app/content/items/equipment/armour/heavy');

class AncientPlateArmour extends HeavyArmour {
  constructor() {
    super({
      type: 'equipment-armour-heavy-032_ancient_plate',
      displayName: __('Ancient Plate'),
      description: __("This armour may be old, but it was made with care and techniques lost to time."),
      level: 32,
      defence: 150,
      dodge: 0,
      gold: 3750,
    });
  }
}

module.exports = AncientPlateArmour;