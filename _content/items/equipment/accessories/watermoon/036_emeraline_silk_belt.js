"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class EmeralineSilkBeltAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-watermoon-036_emeraline_silk_belt',
      displayName: __('Emeraline Silk Belt'),
      description: __('This bright green belt fills you with sorcerous power when you touch it.'),
      level: 36,
      spellPower: 25,
      gold: 1750,
    });
  }
}

module.exports = EmeralineSilkBeltAccessory;