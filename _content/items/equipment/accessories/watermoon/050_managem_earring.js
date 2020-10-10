"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class ManagemEarringAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-watermoon-050_managem_earring',
      displayName: __('Managem Earring'),
      description: __("Composed of a single managem, it requires no setting, attaching directly to your ear by a mysterious force."),
      level: 50,
      maxMp: 150,
      gold: 3000,
    });
  }
}

module.exports = ManagemEarringAccessory;