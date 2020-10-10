"use strict";

const Armour = require('@app/content/items/equipment/armour');

class FullscaleArmour extends Armour {
  constructor() {
    super({
      type: 'equipment-armour-019_fullscale',
      displayName: __('Fullscale'),
      description: __('Each scale used in this armour is hand-crafted for maximum protection.'),
      level: 19,
      defence: 45,
      dodge: 0,
      gold: 1250,
    });
  }
}

module.exports = FullscaleArmour;