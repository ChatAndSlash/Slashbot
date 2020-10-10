"use strict";

const Accesory = require('@app/content/items/equipment/accessories');

class GarnetLoopAccessory extends Accesory {
  constructor() {
    super({
      type: 'equipment-accessories-005_malachite_band',
      displayName: __('Malachite Band'),
      description: __('A thin ring made of malachite.'),
      level: 5,
      dodge: 5,
      gold: 50,
    });
  }
}

module.exports = GarnetLoopAccessory;
