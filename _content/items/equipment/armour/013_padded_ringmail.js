"use strict";

const Armour = require('@app/content/items/equipment/armour');

class PaddedRingmailArmour extends Armour {
  constructor() {
    super({
      type: 'equipment-armour-013_padded_ringmail',
      displayName: __('Padded Ringmail'),
      description: __('Padded leather armour helps absorb light blows, while the metal rings sewn into this armour can deflect many blade strikes.'),
      level: 13,
      defence: 35,
      dodge: 0,
      gold: 600,
    });
  }
}

module.exports = PaddedRingmailArmour;