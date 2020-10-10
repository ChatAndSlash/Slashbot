"use strict";

const ArcaneArmour = require('@app/content/items/equipment/armour/arcane');

class IncarnadineRobeArmour extends ArcaneArmour {
  constructor() {
    super({
      type: 'equipment-armour-arcane-039_incarnadine_robe',
      displayName: __("Incarnadine Robe"),
      description: __("This robe is the same colour of bright, fresh blood.  Wisps of the same colour float from it, making it almost seem as if the wearer is bleeding _upwards._"),
      level: 39,
      defence: 150,
      spellPower: 32,
      gold: 5250,
    });
  }
}

module.exports = IncarnadineRobeArmour;