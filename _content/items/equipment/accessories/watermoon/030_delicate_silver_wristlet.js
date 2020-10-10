"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class DelicateSilverWristletAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-watermoon-030_delicate_silver_wristlet',
      displayName: __("Delicate Silver Wristlet"),
      description: __("This thin, beaten silver bracelet imbues you with a feeling of resilience."),
      level: 30,
      maxHp: 150,
      gold: 1250,
    });
  }
}

module.exports = DelicateSilverWristletAccessory;