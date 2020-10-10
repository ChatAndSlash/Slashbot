"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const HallwayLocation   = require('@mixins/location/hallway').HallwayLocation;

/**
 * Glowing hallway.  Enemies drop extra moondrops.
 */
class GlowingHallwayLocation extends mix(WatermoonLocation).with(HallwayLocation()) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallway-glowing',
      displayName: __('Glowing Hallway'),
      image: 'locations/watermoon/glowing-hallway.png',
      enemies: [
        { value: 'watermoon-scholar-hallways-burning_eidolon', weight: 2 },
        { value: 'watermoon-scholar-hallways-screaming_eidolon', weight: 2 },
        { value: 'watermoon-scholar-hallways-weeping_eidolon', weight: 2 },
        { value: 'watermoon-scholar-hallways-shining_eidolon', weight: 1 },
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
    return __("*Watermoon, Scholar District*\nThe very walls of this hallway glow with a soft, comforting light, much like the light of the moon on a calm, spring night.  This is in sharp contrast to the terrifying Eidolons that haunt these halls and jealously guard the Moondrops they've harvested over the years.%s", progressText);
  }
}

module.exports = GlowingHallwayLocation;