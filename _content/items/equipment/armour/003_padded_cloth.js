"use strict";

const Armour = require('@app/content/items/equipment/armour');

class PaddedClothArmour extends Armour {
  constructor() {
    super({
      type: 'equipment-armour-003_padded_cloth',
      displayName: __('Padded Cloth'),
      description: __('Simple cloth with padding.'),
      level: 3,
      defence: 10,
      dodge: 0,
      gold: 20,
    });
  }
}

module.exports = PaddedClothArmour;