"use strict";

const Relic = require('@app/content/items/equipment/relics');

class MahoganyStaffRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-044_mahogany_staff',
      displayName: __('Mahogany Staff'),
      description: __("This staff is very heavy, not only with the weight of the wood, but with with the weight of the enchantments placed upon it."),
      level: 44,
      spellPower: 95,
      gold: 3750,
    });
  }
}

module.exports = MahoganyStaffRelic;