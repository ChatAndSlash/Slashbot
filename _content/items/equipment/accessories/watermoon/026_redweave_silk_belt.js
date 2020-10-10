"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class RedweaveSilkBeltAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-watermoon-026_redweave_silk_belt',
      displayName: __('Redweave Silk Belt'),
      description: __('This soft silk belt is made of the finest redweave, a magical cloth much desired by sorcerous folk.'),
      level: 26,
      spellPower: 15,
      gold: 1000,
    });
  }
}

module.exports = RedweaveSilkBeltAccessory;