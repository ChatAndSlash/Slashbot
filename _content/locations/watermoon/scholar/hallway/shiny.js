"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const HallwayLocation   = require('@mixins/location/hallway').HallwayLocation;

/**
 * Shiny hallway.  Enemies drop extra gold.
 */
class ShinyHallwayLocation extends mix(WatermoonLocation).with(HallwayLocation()) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallway-shiny',
      displayName: __('Shiny Hallway'),
      image: 'locations/watermoon/shiny-hallway.png',
      enemies: [
        { value: 'watermoon-scholar-hallways-brass_bull', weight: 1 },
        { value: 'watermoon-scholar-hallways-brass_boar', weight: 1 },
        { value: 'watermoon-scholar-hallways-brass_bear', weight: 1 },
        { value: 'watermoon-scholar-hallways-brass_beetle', weight: 1 },
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
    return __("*Watermoon, Scholar District*\nScraps of metal line the edges of the walls.  They clearly come from the mechanical animals that roam these halls, animals that are -- for some reason -- jam-packed full of glistening golden coins!%s", progressText);
  }
}

module.exports = ShinyHallwayLocation;