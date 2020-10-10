"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class InlaidCopperBangleAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-watermoon-020_inlaid_copper_bangle',
      displayName: __('Inlaid Copper Bangle'),
      description: __('This delicate, burnished wooden bangle has bright, shining copper wire inlaid in geometric patterns.'),
      level: 20,
      maxHp: 100,
      gold: 550,
    });
  }
}

module.exports = InlaidCopperBangleAccessory;