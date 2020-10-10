"use strict";

const Relic = require('@app/content/items/equipment/relics');

class BrassChaliceRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-031_brass_chalice',
      displayName: __('Brass Chalice'),
      description: __("A simple-looking brass cup with writing that individuals without arcane knowledge may mistakenly use to drink from."),
      level: 31,
      spellPower: 69,
      gold: 2500,
    });
  }
}

module.exports = BrassChaliceRelic;