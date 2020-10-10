"use strict";

const Location = require('@app/content/locations').Location;

/**
 * A wrapper location for the merchants in this area.
 */
class MerchantsLocation extends Location {
  constructor() {
    super({
      type: 'scatterslide-merchants',
      displayName: "Merchants",
      buttonText: "Merchants",
      description: "A stern-looking blacksmith, an aged artificer, and a provisioner in a faded, floppy brown hat all stand nearby, engaging in commerce with the camp's patrons.",
      image: 'locations/scatterslide/provisioner.png',
      connectedLocations: [
        'scatterslide-campfire',
        'scatterslide-provisioner',
        'scatterslide-blacksmith',
        'scatterslide-artificer',
      ],
    });
  }
}

module.exports = MerchantsLocation;