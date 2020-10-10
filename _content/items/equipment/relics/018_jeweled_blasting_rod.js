"use strict";

const Relic = require('@app/content/items/equipment/relics');

class JeweledBlastingRodRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-018_jeweled_blasting_rod',
      displayName: __('Jeweled Blasting Rod'),
      description: __('Every jewel set in this rod is individually carved with magic-enhancing runes.'),
      spellPower: 30,
      level: 18,
      gold: 1150,
    });
  }
}

module.exports = JeweledBlastingRodRelic;