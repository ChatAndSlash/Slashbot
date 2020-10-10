"use strict";

const Armour = require('@app/content/items/equipment/armour');

class ShardscaleArmour extends Armour {
  constructor() {
    super({
      type: 'equipment-armour-017_shardscale',
      displayName: __('Shardscale'),
      description: __('Made from shards of metal chipped from other projects.  Still quite protective.'),
      level: 17,
      defence: 40,
      dodge: 0,
      gold: 1000,
    });
  }
}

module.exports = ShardscaleArmour;