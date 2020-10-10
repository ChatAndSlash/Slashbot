"use strict";

const Accessory = require('@app/content/items/equipment/accessories');
const Num       = require('@util/num');

const ENCOUNTER_CHANCE = 0.05;

class GoldscaleRingAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-watermoon-050_goldscale_ring',
      displayName: __('Goldscale Ring'),
      description: __("A simple ring worked from the scale of a golden drake."),
      level: 50,
      gold: 5000,
    });
  }

  /**
   * Get a description of how this item will change the provided character's stats.
   *
   * @param {Character} character - The character to evaluate against.
   *
   * @return {string}
   */
  getShopDescription(character) {
    return __("A simple ring worked from the scale of a golden drake.");
  }

  /**
   * Add Gold Drake encounter, if applicable in current area.
   *
   * @param {array} encounters - The encounters to add to.
   *
   * @return {array}
   */
  addGoldDrakeEncounter(encounters) {
    let totalWeight = 0;
    for (let encounter of encounters) {
      encounter.weight *= 100;
      totalWeight += encounter.weight;
    }

    const encounterWeight = Num.getIncreaseForPercentage(totalWeight, ENCOUNTER_CHANCE);
    encounters.push({ value: 'watermoon-golden_drake', weight: encounterWeight });

    return encounters;
  }
}

module.exports = GoldscaleRingAccessory;