"use strict";

const Location = require('@app/content/locations').Location;

/**
 * The shoppes in the city of Tyrose.
 */
class Shoppes extends Location {
  constructor() {
    super({
      type: 'tyrose-shoppes',
      displayName: __('Shoppes'),
      description: __('You stand in the middle of a bustling market square.  All kinds of shoppes are spread around you, selling all kinds of wonderful goods.'),
      image: 'locations/tyrose/shoppes.png',
      connectedLocations: [
        'tyrose',
        'tyrose-shoppes-blacksmith',
        'tyrose-shoppes-rings',
        'tyrose-shoppes-pets',
      ]
    });
  }
}

module.exports = Shoppes;