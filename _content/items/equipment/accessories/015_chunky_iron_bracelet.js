"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class ChunkyIronBraceletAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-015_chunky_iron_bracelet',
      displayName: __('Chunky Iron Bracelet'),
      description: __('A heavy iron bracelet with a carving of an ox on it.'),
      level: 15,
      maxHp: 50,
      gold: 150,
    });
  }
}

module.exports = ChunkyIronBraceletAccessory;