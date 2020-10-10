"use strict";

const HeavyArmour = require('@app/content/items/equipment/armour/heavy');

class WaxedPlateArmour extends HeavyArmour {
  constructor() {
    super({
      type: 'equipment-armour-heavy-027_waxed_plate',
      displayName: __('Waxed Plate'),
      description: __('Plate armour that has had all the dents beaten out of it and waxed to help weapons slide off of it.'),
      level: 27,
      defence: 110,
      dodge: 0,
      gold: 2750,
    });
  }
}

module.exports = WaxedPlateArmour;