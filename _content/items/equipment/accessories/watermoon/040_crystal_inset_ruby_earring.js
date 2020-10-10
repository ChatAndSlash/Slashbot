"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class CrystalInsetRubyEarringAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-watermoon-040_crystal_inset_ruby_earring',
      displayName: __('Crystal-inset Ruby Earring'),
      description: __('A gorgeous white crystal earring with a bloodred ruby set in it.'),
      level: 40,
      maxMp: 100,
      gold: 2000,
    });
  }
}

module.exports = CrystalInsetRubyEarringAccessory;