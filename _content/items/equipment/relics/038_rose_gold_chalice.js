"use strict";

const Relic = require('@app/content/items/equipment/relics');

class RoseGoldChaliceRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-038_rose_gold_chalice',
      displayName: __('Rose Gold Chalice'),
      description: __("A high-end chalice for the discerning magician.  When you see a magician with a Rose Gold Chalice, you know they spent the extra dollar on their equipment."),
      level: 38,
      spellPower: 83,
      gold: 3250,
    });
  }
}

module.exports = RoseGoldChaliceRelic;