"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const HallwayLocation   = require('@mixins/location/hallway').HallwayLocation;

/**
 * Detour, longest hallway.
 */
class DetourHallwayLocation extends mix(WatermoonLocation).with(HallwayLocation()) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallway-detour',
      displayName: __('Detour Hallway'),
      image: 'locations/watermoon/detour-hallway.png',
      enemies: [
        { value: 'watermoon-scholar-hallways-centaur_archer', weight: 1 },
        { value: 'watermoon-scholar-hallways-centaur_slasher', weight: 1 },
        { value: 'watermoon-scholar-hallways-centaur_bladesmith', weight: 1 },
        { value: 'watermoon-scholar-hallways-centaur_faithful', weight: 1 },
        { value: 'watermoon-scholar-hallways-centaur_warmage', weight: 1 },
        { value: 'watermoon-scholar-hallways-harpy_mistress', weight: 1 },
        { value: 'watermoon-scholar-hallways-harpy_witch', weight: 1 },
        { value: 'watermoon-scholar-hallways-harpy_bladesong', weight: 1 },
        { value: 'watermoon-scholar-hallways-harpy_chieftess', weight: 1 },
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
    return __("*Watermoon, Scholar District*\nOh _dang,_ this is a long hallway.  Why didn't you go the other way again?%s", progressText);
  }

  /**
   * Gets the length of this hallway.
   *
   * @return {integer}
   */
  getLength() {
    return 25;
  }
}

module.exports = DetourHallwayLocation;