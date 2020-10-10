"use strict";

const Relic = require('@app/content/items/equipment/relics');

class SnakewoodStaffRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-046_snakewood_staff',
      displayName: __('Snakewood Staff'),
      description: __("While not actually made of snakes, the wood of this staff is pebbley in texture, like snakesnin would be."),
      level: 46,
      spellPower: 99,
      gold: 4000,
    });
  }
}

module.exports = SnakewoodStaffRelic;