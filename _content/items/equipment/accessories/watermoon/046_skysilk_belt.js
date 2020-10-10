"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class SkysilkBeltAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-watermoon-046_skysilk_belt',
      displayName: __('Skysilk Belt'),
      description: __("This belt is made of a special material that changes colour to match the sky above."),
      level: 46,
      spellPower: 35,
      gold: 2500,
    });
  }
}

module.exports = SkysilkBeltAccessory;