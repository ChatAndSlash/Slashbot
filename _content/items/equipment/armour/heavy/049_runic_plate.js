"use strict";

const HeavyArmour = require('@app/content/items/equipment/armour/heavy');

class RunicPlateArmour extends HeavyArmour {
  constructor() {
    super({
      type: 'equipment-armour-heavy-049_runic_plate',
      displayName: __('Runic Plate'),
      description: __("This armour is covered in hundreds of tiny glowing runes, adding stunning arcane protection to an already well-crafted set of armour."),
      level: 49,
      defence: 310,
      dodge: 0,
      gold: 7500,
    });
  }
}

module.exports = RunicPlateArmour;