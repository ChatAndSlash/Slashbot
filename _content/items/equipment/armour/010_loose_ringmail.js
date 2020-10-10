"use strict";

const Armour = require('@app/content/items/equipment/armour');

class LooseRingmailArmour extends Armour {
  constructor() {
    super({
      type: 'equipment-armour-010_loose_ringmail',
      displayName: __('Loose Ringmail'),
      description: __('These loose-woven mail links offer reasonable protection without adding much weight.'),
      level: 10,
      defence: 30,
      dodge: 0,
      gold: 300,
    });
  }
}

module.exports = LooseRingmailArmour;