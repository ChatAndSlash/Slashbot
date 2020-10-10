"use strict";

const Location = require('@app/content/locations').Location;

/**
 * Auric Avenue.  Hub.
 */
class AuricAve extends Location {
  constructor() {
    super({
      type: 'watermoon-gilded-auric_ave',
      displayName: __('Auric Avenue'),
      description: __("*Watermoon, Gilded District*\nBright yellow cobblestones line this street.  Though not actually gold, they shimmer and sparkle in an opulet way, as befitting the city's finest emporiums."),
      image: 'locations/city.png',
      connectedLocations: [
        'watermoon-gilded-courtyard',
        'watermoon-gilded-boutique',
        'watermoon-gilded-pharmacy',
        'watermoon-gilded-haberdashery',
        'watermoon-gilded-party_central',
      ],
    });
  }
}

module.exports = AuricAve;