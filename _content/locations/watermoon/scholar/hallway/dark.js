"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const HallwayLocation   = require('@mixins/location/hallway').HallwayLocation;

/**
 * Dark hallway, requires light.
 */
class DarkHallwayLocation extends mix(WatermoonLocation).with(HallwayLocation()) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallway-dark',
      displayName: __('Dark Hallway'),
      image: 'locations/watermoon/dark-hallway.png',
      enemies: [
        { value: 'watermoon-scholar-hallways-amphisbaena', weight: 1 },
        { value: 'watermoon-scholar-hallways-arae', weight: 1 },
        { value: 'watermoon-scholar-hallways-crocotta', weight: 1 },
        { value: 'watermoon-scholar-hallways-manticore', weight: 1 },
        { value: 'watermoon-scholar-hallways-myrmekes', weight: 1 },
      ],
      light: 0,
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
    return __("*Watermoon, Scholar District*\nThis hallways is pitch-black.  Every step you take is filled with danger, enemies likely lurking behind every corner.%s", progressText);
  }
}

module.exports = DarkHallwayLocation;