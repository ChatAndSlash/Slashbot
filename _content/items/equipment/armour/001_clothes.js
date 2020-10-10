"use strict";

const Armour = require('@app/content/items/equipment/armour');

class ClothesArmour extends Armour {
  constructor() {
    super({
      type: 'equipment-armour-001_clothes',
      displayName: __('Clothes'),
      description: __('The clothes on your back.'),
      defence: 5,
      dodge: 0,
      gold: 0,
    });
  }
}

module.exports = ClothesArmour;