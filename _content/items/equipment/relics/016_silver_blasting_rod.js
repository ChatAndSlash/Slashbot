"use strict";

const Relic = require('@app/content/items/equipment/relics');

class SilverBlastingRodRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-016_silver_blasting_rod',
      displayName: __('Silver Blasting Rod'),
      description: __('Silver is well-known for its ability to channel magic, making this rod quite powerful.'),
      spellPower: 27,
      level: 16,
      gold: 850,
    });
  }
}

module.exports = SilverBlastingRodRelic;