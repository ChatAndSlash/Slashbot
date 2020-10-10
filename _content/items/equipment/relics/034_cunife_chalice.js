"use strict";

const Relic = require('@app/content/items/equipment/relics');

class CunifeChaliceRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-034_cunife_chalice',
      displayName: __('Cunife Chalice'),
      description: __("A rare alloy of copper, nickel, and iron, this chalice is adept for all kinds of magic."),
      level: 34,
      spellPower: 75,
      gold: 2750,
    });
  }
}

module.exports = CunifeChaliceRelic;