"use strict";

const Location = require('@app/content/locations').Location;

/**
 * Courtyard.  Hub.
 */
class Courtyard extends Location {
  constructor() {
    super({
      type: 'watermoon-gilded-courtyard',
      displayName: __('Courtyard'),
      description: __("*Watermoon, Gilded District*\nAn enormous, opulent statue of a dragon stands in the middle of a fountain in the center of the courtyard.  Water spews from its mouth onto a small group of statues representing brave, but clearly misguided soldiers."),
      image: 'locations/city.png',
      connectedLocations: [
        'watermoon-fountain',
        'watermoon-gilded-exchange',
        'watermoon-gilded-auric_ave',
        'watermoon-gilded-sterling_st',
        'watermoon-gilded-back_alley',
      ],
    });
  }

  /**
   * Get the text for this location to display on the travel button.
   *
   * @param {Character} character - The character travelling.
   *
   * @return string
   */
  getButtonText(character) {
    return 'watermoon-fountain' === character.location.type
      ? __("Gilded District")
      : this.getDisplayName(character);
  }
}

module.exports = Courtyard;