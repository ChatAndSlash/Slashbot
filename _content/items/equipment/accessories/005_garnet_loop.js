"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class GarnetLoopAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-005_garnet_loop',
      displayName: __('Garnet Loop'),
      description: __('A simple ring with a small garnet set in it.'),
      level: 5,
      crit: 5,
      gold: 50,
    });
  }
}

module.exports = GarnetLoopAccessory;