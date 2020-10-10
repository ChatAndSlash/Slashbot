"use strict";

const Relic = require('@app/content/items/equipment/relics');

class RosewoodRitualKnifeRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-024_rosewood_ritual_knife',
      displayName: __('Rosewood Ritual Knife'),
      description: __("Rosewood is a well-known natural conductor of magic, with Rosewood trees themselves occasionally taking on the attributes of spells cast near them."),
      level: 24,
      spellPower: 55,
      gold: 1750,
    });
  }
}

module.exports = RosewoodRitualKnifeRelic;