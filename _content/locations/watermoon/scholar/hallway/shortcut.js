"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const HallwayLocation   = require('@mixins/location/hallway').HallwayLocation;

/**
 * Shortcut, shortest hallway.
 */
class ShortcutHallwayLocation extends mix(WatermoonLocation).with(HallwayLocation()) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallway-shortcut',
      displayName: __('Shortcut Hallway'),
      image: 'locations/watermoon/shortcut-hallway.png',
      enemies: [
        { value: 'watermoon-scholar-hallways-centaur_archer', weight: 1 },
        { value: 'watermoon-scholar-hallways-centaur_slasher', weight: 1 },
        { value: 'watermoon-scholar-hallways-centaur_bladesmith', weight: 1 },
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
    return __("*Watermoon, Scholar District*\nThis is the shortest possible hallways to encounter in this dungeon.  So short, you can see the end of it from here!%s", progressText);
  }

  /**
   * Gets the length of this hallway.
   *
   * @return {integer}
   */
  getLength() {
    return 5;
  }
}

module.exports = ShortcutHallwayLocation;