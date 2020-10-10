"use strict";

const Relic = require('@app/content/items/equipment/relics');

class BlackwoodStaffRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-048_blackwood_staff',
      displayName: __('Blackwood Staff'),
      description: __("This staff is a deep, midnight black, reflecting no light.  It absorbs perfectly all the magic sent into it, and redirects it at its target with devastating force."),
      level: 48,
      spellPower: 110,
      gold: 4500,
    });
  }
}

module.exports = BlackwoodStaffRelic;