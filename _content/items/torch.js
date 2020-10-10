"use strict";

const Item = require('@app/content/items').Item;

class Torch extends Item {
  constructor() {
    super({
      type: 'torch',
      displayName: __('Torch'),
      description: __("A guttering, sputtering torch.  This will light your way in dark areas, but is rudimentary, and will only last for one fight."),
      gold: 1,
    });
  }

  /**
   * Get a description of how this item will change the provided character's stats.
   *
   * @param Character character The character to evaluate against.
   *
   * @return string
   */
  getShopDescription(character) {
    return __('See in dark areas, revealing sneaky enemies and secrets.');
  }
}

module.exports = Torch;