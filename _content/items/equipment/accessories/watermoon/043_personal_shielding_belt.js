"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class PersonalShieldingBestAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-watermoon-043_personal_shielding_belt',
      displayName: __("Personal Shielding Belt"),
      description: __("A solid, chunky leather belt that projects a small energy shield around your body."),
      level: 43,
      defence: 50,
      gold: 2250,
    });
  }
}

module.exports = PersonalShieldingBestAccessory;