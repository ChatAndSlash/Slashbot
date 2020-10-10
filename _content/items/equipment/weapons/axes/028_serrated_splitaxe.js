"use strict";

const Axes = require('@app/content/items/equipment/weapons/axes');

class SerratedSplitaxeWeapon extends Axes {
  constructor() {
    super({
      type: 'equipment-weapons-axes-028_serrated_splitaxe',
      displayName: __('Serrated Splitaxe'),
      description: __("The blade on this axe is serrated and split in two, which - while it doesn't necessarily make it more dangerous - it makes it more terrifying."),
      level: 28,
      minDamage: 26,
      maxDamage: 55,
      crit: 5,
      gold: 2500,
    });
  }
}

module.exports = SerratedSplitaxeWeapon;