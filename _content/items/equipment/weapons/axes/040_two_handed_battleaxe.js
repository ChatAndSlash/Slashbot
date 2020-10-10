"use strict";

const Axes = require('@app/content/items/equipment/weapons/axes');

class TwoHandedBattleaxeWeapon extends Axes {
  constructor() {
    super({
      type: 'equipment-weapons-axes-040_two_handed_battleaxe',
      displayName: __('Two-handed Battleaxe'),
      description: __("This battleaxe requires two hands to hold at all, let along use effectively."),
      level: 40,
      minDamage: 45,
      maxDamage: 75,
      crit: 5,
      gold: 5000,
    });
  }
}

module.exports = TwoHandedBattleaxeWeapon;