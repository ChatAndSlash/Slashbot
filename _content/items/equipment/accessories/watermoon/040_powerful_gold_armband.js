"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class PowerfulGoldArmbandAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-watermoon-040_powerful_gold_armband',
      displayName: __("Powerful Gold Armband"),
      description: __("Thick and made of brilliand gold, this armband fairly radiates power."),
      level: 40,
      maxHp: 200,
      gold: 2000,
    });
  }
}

module.exports = PowerfulGoldArmbandAccessory;