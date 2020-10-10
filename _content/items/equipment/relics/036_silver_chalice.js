"use strict";

const Relic = require('@app/content/items/equipment/relics');

class SilverChaliceRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-036_silver_chalice',
      displayName: __('Silver Chalice'),
      description: __("When empty you can see your own (albeit distorted) reflection in this cup."),
      level: 36,
      spellPower: 79,
      gold: 3000,
    });
  }
}

module.exports = SilverChaliceRelic;