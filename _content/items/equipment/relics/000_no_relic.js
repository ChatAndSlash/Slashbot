"use strict";

const Relic = require('@app/content/items/equipment/relics');

class NoRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-000_no_relic',
      displayName: __('No Relic'),
      description: __('You do not have a relic.'),
    });
  }
}

module.exports = NoRelic;