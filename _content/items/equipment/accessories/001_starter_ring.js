"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class StarterRingAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-001_starter_ring',
      displayName: __('Starter Ring'),
      description: __('A plain iron ring.'),
      maxHp: 5,
      gold: 0,
    });
  }
}

module.exports = StarterRingAccessory;