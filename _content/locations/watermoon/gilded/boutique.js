"use strict";

const Location = require('@app/content/locations').Location;

/**
 * Boutique.  Alchemy.
 */
class BoutiqueLocation extends Location {
  constructor() {
    super({
      type: 'watermoon-gilded-boutique',
      displayName: __('Boutique'),
      description: __("*Watermoon, Gilded District*\nA variety of flasks sit on the shelves, bubbling wildly.  The proprieter fixes you with a look.  \"I can tell you're the kind of person who's never satisfied.  Well, you've come to the right place!  For the low, low price of a few Moondrops, I can fix you up with some of these fine beauties, which will make you more powerful than you ever imagined!\""),
      image: 'locations/city.png',
      connectedLocations: [
        'watermoon-gilded-auric_ave',
      ],
      flasks: [
        'minDamage',
        'maxDamage',
        'spellPower',
      ],
      flaskText: __("Powerful?"),
    });
  }
}

module.exports = BoutiqueLocation;