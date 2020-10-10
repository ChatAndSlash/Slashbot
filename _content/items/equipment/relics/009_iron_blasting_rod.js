"use strict";

const Relic = require('@app/content/items/equipment/relics');

class IronBlastingRodRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-009_iron_blasting_rod',
      displayName: __('Iron Blasting Rod'),
      description: __('This short iron rod has runes carved in it to aid magical channeling.'),
      spellPower: 17,
      level: 9,
      gold: 250,
    });
  }
}

module.exports = IronBlastingRodRelic;