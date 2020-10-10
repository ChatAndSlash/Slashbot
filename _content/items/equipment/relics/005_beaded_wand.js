"use strict";

const Relic = require('@app/content/items/equipment/relics');

class BeadedWandRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-005_beaded_wand',
      displayName: __('Beaded Wand'),
      description: __('This wand sports dozens of pretty little beads.'),
      spellPower: 5,
      level: 5,
      gold: 75,
    });
  }
}

module.exports = BeadedWandRelic;