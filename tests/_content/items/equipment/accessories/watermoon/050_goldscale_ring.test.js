/*eslint-env mocha */
"use strict";

const GoldscaleRingAccessory = require('@content/items/equipment/accessories/watermoon/050_goldscale_ring');

describe('GoldscaleRingAccessory', () => {
  describe('addGoldDrakeEncounter', () => {
    it('should add encounter', () => {
      const accessory = new GoldscaleRingAccessory();
      const encounters = [
        { weight: 60 },
        { weight: 30 },
        { weight: 9 }
      ];

      expect(accessory.addGoldDrakeEncounter(encounters)).toEqual([
        { weight: 6000 },
        { weight: 3000 },
        { weight: 900 },
        { value: "watermoon-golden_drake", weight: 522 }
      ]);
    });
  });
});