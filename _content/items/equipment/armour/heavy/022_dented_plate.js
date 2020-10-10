"use strict";

const HeavyArmour = require('@app/content/items/equipment/armour/heavy');

class DentedPlateArmour extends HeavyArmour {
  constructor() {
    super({
      type: 'equipment-armour-heavy-022_dented_plate',
      displayName: __('Dented Plate'),
      description: __('Dented plate armour, recovered from the loser of a particularly nasty fight.  Still protects pretty well, though.'),
      level: 22,
      defence: 75,
      dodge: 0,
      gold: 1750,
    });
  }
}

module.exports = DentedPlateArmour;