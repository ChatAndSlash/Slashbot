"use strict";

const HeavyArmour = require('@app/content/items/equipment/armour/heavy');

class ReinforcedPlateArmour extends HeavyArmour {
  constructor() {
    super({
      type: 'equipment-armour-heavy-037_reinforced_plate',
      displayName: __('Reinforced Plate'),
      description: __("An older set of plate armour, still sturdy, but reinforced with strong bands of gleaming metal."),
      level: 37,
      defence: 190,
      dodge: 0,
      gold: 4750,
    });
  }
}

module.exports = ReinforcedPlateArmour;