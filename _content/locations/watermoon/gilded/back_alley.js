"use strict";

const Location = require('@app/content/locations').Location;

/**
 * Back Alley.  Hub trainer.
 */
class BackAlley extends Location {
  constructor() {
    super({
      type: 'watermoon-gilded-back_alley',
      displayName: __('Back Alley'),
      description: __("*Watermoon, Gilded District*\nSeedy individuals are carousing along the sides of the alley, beckoning you towards their establishments."),
      image: 'locations/city.png',
      connectedLocations: [
        'watermoon-gilded-courtyard',
        'watermoon-gilded-coven',
        'watermoon-gilded-misty_moon',
      ],
    });
  }
}

module.exports = BackAlley;