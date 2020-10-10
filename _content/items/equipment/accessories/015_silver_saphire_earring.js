"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class SilverSaphireEarringAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-015_silver_saphire_earring',
      displayName: __('Silver Saphire Earring'),
      description: __('A silver earring with a small saphire set in it.'),
      level: 15,
      maxMp: 25,
      gold: 150,
    });
  }
}

module.exports = SilverSaphireEarringAccessory;