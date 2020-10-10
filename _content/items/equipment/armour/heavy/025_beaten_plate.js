"use strict";

const HeavyArmour = require('@app/content/items/equipment/armour/heavy');

class BeatenPlateArmour extends HeavyArmour {
  constructor() {
    super({
      type: 'equipment-armour-heavy-025_beaten_plate',
      displayName: __('Beaten Plate'),
      description: __('Recovered plate armour, with all the dents beaten out of it.'),
      level: 25  ,
      defence: 90,
      dodge: 0,
      gold: 2250,
    });
  }
}

module.exports = BeatenPlateArmour;