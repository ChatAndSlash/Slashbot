"use strict";

const Relic = require('@app/content/items/equipment/relics');

class SteelBlastingRodRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-012_steel_blasting_rod',
      displayName: __('Steel Blasting Rod'),
      description: __('Designed for the explicit purpose of casting magic, this rod is also quite useful in any bar fights the owner may get in.'),
      spellPower: 21,
      level: 12,
      gold: 550,
    });
  }
}

module.exports = SteelBlastingRodRelic;