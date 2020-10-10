"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class GoldMoonstoneEarringAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-watermoon-020_gold_moonstone_earring',
      displayName: __('Gold Moonstone Earring'),
      description: __('A golden earring with a blue moonstone set in it.'),
      level: 20,
      maxMp: 50,
      gold: 550,
    });
  }
}

module.exports = GoldMoonstoneEarringAccessory;