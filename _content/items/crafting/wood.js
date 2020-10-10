"use strict";

let Crafting = require('@app/content/items/crafting').Crafting;

class Wood extends Crafting {
  constructor() {
    super({
      type: 'crafting-wood',
      displayName: __('Wood'),
      description: __('Wood used for crafting, I guess.'),
    });
  }
}

module.exports = Wood;