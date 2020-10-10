"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const HallwayLocation   = require('@mixins/location/hallway').HallwayLocation;

/**
 * Barren hallway.  Enemies drop no gold.
 */
class BarrenHallwayLocation extends mix(WatermoonLocation).with(HallwayLocation()) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallway-barren',
      displayName: __('Barren Hallway'),
      image: 'locations/watermoon/barren-hallway.png',
      enemies: [
        { value: 'watermoon-scholar-hallways-lost_missionary', weight: 1 },
        { value: 'watermoon-scholar-hallways-lost_thief', weight: 1 },
        { value: 'watermoon-scholar-hallways-lost_survivor', weight: 1 },
        { value: 'watermoon-scholar-hallways-lost_wanderer', weight: 1 },
        { value: 'watermoon-scholar-hallways-lost_tracker', weight: 1 },
      ],
    });
  }

  /**
   * Gets the description for this location.
   *
   * @param {Character} character - The character getting the description.
   *
   * @return {string}
   */
  getDescription(character) {
    const progressText = this.getProgressText(character);
    return __("*Watermoon, Scholar District*\nThis hallway is bare and sterile.  Nothing grows here, and all who wander here are, indeed, lost.  Expect to find no treasures here.%s", progressText);
  }
}

module.exports = BarrenHallwayLocation;