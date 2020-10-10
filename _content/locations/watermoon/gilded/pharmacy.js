"use strict";

const Location = require('@app/content/locations').Location;

/**
 * Pharmacy.  Sells items.
 */
class Pharmacy extends Location {
  constructor() {
    super({
      type: 'watermoon-gilded-pharmacy',
      displayName: __('Pharmacy'),
      description: __("*Watermoon, Gilded District*\nA harried blonde woman dashes around behind the counter, filling vials and affixing labels.  \"One moment!\" she calls, as you peruse the items on offer."),
      image: 'locations/watermoon/pharmacy.png',
      connectedLocations: [
        'watermoon-gilded-auric_ave',
      ],
      itemCostMultiplier: 3,
      shopItems: {
        'provisions': {
          shopText: __('Buy Provisions'),
          items: [
            'consumables-potion',
            'consumables-elixir',
            'consumables-antidote',
            'consumables-smelling_salts',
            'consumables-cold_compress',
            'consumables-hot_chocolate',
            'consumables-blessing',
            'consumables-smoke_bomb',
            'torch',
          ],
        },
      },
    });
  }
}

module.exports = Pharmacy;