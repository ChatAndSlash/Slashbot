"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class MasterfulPlatinumArmletAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-watermoon-050_masterful_platinum_armlet',
      displayName: __("Masterful Platinum Armlet"),
      description: __("This bracelet looks like an ordinary piece of platinum jewellery, but provides a deep reservoir of strength for its wearer to draw from."),
      level: 50,
      maxHp: 300,
      gold: 3000,
    });
  }
}

module.exports = MasterfulPlatinumArmletAccessory;