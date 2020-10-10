"use strict";

const QuickArmour = require('@app/content/items/equipment/armour/quick');

class SnakeLeatherArmour extends QuickArmour {
  constructor() {
    super({
      type: 'equipment-armour-quick-042_snake_leather',
      displayName: __("Snake Leather"),
      description: __("It takes _so many snakes_ to put together a single suit of leather.  _So many snakes._"),
      level: 42,
      defence: 170,
      dodge: 6,
      gold: 5750,
    });
  }
}

module.exports = SnakeLeatherArmour;