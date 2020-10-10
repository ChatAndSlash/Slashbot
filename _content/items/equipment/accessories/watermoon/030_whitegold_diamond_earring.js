"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class WhitegoldDiamondEarringAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-watermoon-030_whitegold_diamond_earring',
      displayName: __('Whitegold Diamond Earring'),
      description: __('A soft whilegold earring with a sparkling diamond gem set inside it.'),
      level: 30,
      maxMp: 75,
      gold: 1250,
    });
  }
}

module.exports = WhitegoldDiamondEarringAccessory;