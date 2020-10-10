"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class GlowingPearlRingAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-015_glowing_pearl_ring',
      displayName: __('Glowing Pearl Ring'),
      description: __('A single pearl set in between entwined loops of engraved silver.'),
      level: 15,
      gold: 350,
      providesLight: true
    });
  }

  /**
   * Get a description of how this item will change the provided character's stats.
   *
   * @param {Equipment} oldEquipment - The old equipment to compare to this equipment.
   * @param {array} attributes - The attributes to compare on.
   *
   * @return {string}
   */
  getEquipmentShopDescription(oldEquipment, attributes) {
    if (oldEquipment.type === this.type) {
      return __("--Equipped--");
    }

    return __("Provides light in the darkness.");
  }

}

module.exports = GlowingPearlRingAccessory;