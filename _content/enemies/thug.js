"use strict";

const Enemy    = require('@app/content/enemies').Enemy;
const Loot     = require('@app/loot').Loot;
const LootSlot = require('@app/loot').LootSlot;

class Thug extends Enemy {
  constructor() {
    super({
      type: 'thug',
      displayName: 'Thug',
      description: 'A broadly-grinning hoodlum, intent on taking your gold, or failing that, your life.',
      loot: new Loot(
        new LootSlot().addEntry(100, 'consumables-potion', 1, 2)
      )
    });
  }
}

module.exports = Thug;