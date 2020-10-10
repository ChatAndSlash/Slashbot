"use strict";

const Location = require('@app/content/locations').Location;

/**
 * Sterling Street.  Hub.
 */
class SterlingStreet extends Location {
  constructor() {
    super({
      type: 'watermoon-gilded-sterling_st',
      displayName: __('Sterling Street'),
      description: __("*Watermoon, Gilded District*\nThe shiny white stones underfoot are in places splashed with red, most notably just outside the Coliseum and Casino entrances."),
      image: 'locations/city.png',
      connectedLocations: [
        'watermoon-gilded-courtyard',
        'watermoon-gilded-coliseum',
        'watermoon-gilded-casino',
      ],
    });
  }
}

module.exports = SterlingStreet;