"use strict";

const Relic = require('@app/content/items/equipment/relics');

class RacingWandRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-007_racing_wand',
      displayName: __('Racing Wand'),
      description: __('This wand has a really slick racing stripe up the side.'),
      spellPower: 7,
      level: 7,
      gold: 125,
    });
  }
}

module.exports = RacingWandRelic;