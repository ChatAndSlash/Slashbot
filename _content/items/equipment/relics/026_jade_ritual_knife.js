"use strict";

const Relic = require('@app/content/items/equipment/relics');

class JadeRitualKnifeRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-026_jade_ritual_knife',
      displayName: __('Jade Ritual Knife'),
      description: __("This knife is carved with runes inlaid with gold."),
      level: 26,
      spellPower: 59,
      gold: 2000,
    });
  }
}

module.exports = JadeRitualKnifeRelic;