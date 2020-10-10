"use strict";

const Relic = require('@app/content/items/equipment/relics');

class MapleStaffRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-041_maple_staff',
      displayName: __('Maple Staff'),
      description: __("This long staff is deceptively light, and can be used to cast powerful spells."),
      level: 41,
      spellPower: 89,
      gold: 3500,
    });
  }
}

module.exports = MapleStaffRelic;