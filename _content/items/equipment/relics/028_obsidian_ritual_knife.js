"use strict";

const Relic = require('@app/content/items/equipment/relics');

class ObsidianRitualKnifeRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-028_obsidian_ritual_knife',
      displayName: __('Obsidian Ritual Knife'),
      description: __("A sheer black blade with a dangerously sharp edge, these knifes are just as popular for blood magic as they are for regular magic."),
      level: 28,
      spellPower: 63,
      gold: 2250,
    });
  }
}

module.exports = ObsidianRitualKnifeRelic;