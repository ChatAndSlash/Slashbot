"use strict";

const Location = require('@app/content/locations').Location;

/**
 * The tavern.  Buy potions, elixirs, or flasks.
 */
class Tavern extends Location {
  constructor() {
    super({
      type: 'tyrose-tavern',
      displayName: __('Tavern'),
      description: __('The tavern is busy as always. You step up to the tavernkeeper, who offers you a mug of ale and shows you his stock of potions and elixirs.  "Or perhaps," he says with a sly grin, "you\'re looking for something a little stronger?"'),
      image: 'locations/tyrose/tavern.png',
      connectedLocations: [
        'tyrose',
      ],
      flasks: [
        'force',
        'technique',
        'defence',
      ],
      flaskText: __("Stronger?"),
      shopItems: {
        'potions': {
          shopText: __('Buy Items'),
          items: [
            'consumables-potion',
            'consumables-elixir',
            'consumables-antidote',
            'consumables-smelling_salts',
          ]
        }
      }
    });
  }
}

module.exports = Tavern;