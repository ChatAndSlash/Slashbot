"use strict";

const Relic = require('@app/content/items/equipment/relics');

class SimpleWandRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-001_simple_wand',
      displayName: __('Simple Wand'),
      description: __('A simple wooden wand, absent of markings.'),
      spellPower: 1,
    });
  }
}

module.exports = SimpleWandRelic;