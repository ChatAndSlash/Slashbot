"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class NoAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-000_no_accessory',
      displayName: __('No Accessory'),
      description: __('You are not wearing an accessory.'),
    });
  }
}

module.exports = NoAccessory;